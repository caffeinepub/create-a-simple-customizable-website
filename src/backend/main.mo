import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

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

  var websiteContent : WebsiteContent = {
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

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getWebsiteContent() : async WebsiteContent {
    websiteContent;
  };

  public shared ({ caller }) func updateWebsiteContent(newContent : WebsiteContent) : async () {
    // Per implementation plan: no authorization check - anyone including anonymous can update
    websiteContent := newContent;
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };
};
