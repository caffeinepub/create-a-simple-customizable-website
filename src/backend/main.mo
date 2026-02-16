import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  public type Alignment = {
    #left;
    #center;
    #right;
  };

  public type Position = {
    horizontal : Alignment;
    vertical : {
      #top;
      #middle;
      #bottom;
    };
  };

  public type HeroContent = {
    sectionTitle : Text;
    sectionBody : Text;
    imageSrc : Text;
    titlePosition : Position;
    bodyPosition : Position;
    imagePosition : Position;
  };

  public type Section = {
    sectionTitle : Text;
    sectionBody : Text;
  };

  public type WebsiteContent = {
    siteTitle : Text;
    heroSection : HeroContent;
    mainSection : Section;
    footerText : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  // Persistent state for draft and live content
  var liveContent : WebsiteContent = {
    siteTitle = "welcome to waxy";
    heroSection = {
      sectionTitle = "Clean business websites with time tracking and invoice management";
      sectionBody = "Try our innovative platform for free";
      imageSrc = "https://placehold.co/600x400";
      titlePosition = {
        horizontal = #left;
        vertical = #top;
      };
      bodyPosition = {
        horizontal = #left;
        vertical = #middle;
      };
      imagePosition = {
        horizontal = #right;
        vertical = #top;
      };
    };
    mainSection = {
      sectionTitle = "Empower your business with WAXY";
      sectionBody = "Launch a professional website on the Internet Computer in seconds. Use the productivity tools to simplify all business processes.";
    };
    footerText = "Built with WAXY on the Internet Computer.";
  };

  var draftContent : WebsiteContent = liveContent;
  var userProfiles = Map.empty<Principal, UserProfile>();

  // Website Content Management APIs

  public query ({ caller }) func getLiveContent() : async WebsiteContent {
    // Public access - no authorization check needed
    liveContent;
  };

  public query ({ caller }) func getDraftContent() : async WebsiteContent {
    // Only admins can view draft content
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view draft content");
    };
    draftContent;
  };

  public shared ({ caller }) func updateDraftContent(newContent : WebsiteContent) : async () {
    // Only admins can update draft content
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update draft content");
    };
    draftContent := newContent;
  };

  public shared ({ caller }) func publishDraft() : async () {
    // Only admins can publish draft to live
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can publish content");
    };
    liveContent := draftContent;
  };

  // User Profile Management

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    // Users and admins can access their own profiles
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    // Users can view their own profile, but only admins can view others
    let isViewingOwnProfile = caller == user;
    if (not isViewingOwnProfile and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view profiles of other users");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    // Only users can update their own profiles
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };
};
