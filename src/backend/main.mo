import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Migration "migration";

// Use migration is used to update website content to
(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type Section = {
    sectionTitle : Text;
    sectionBody : Text;
  };

  public type WebsiteContent = {
    siteTitle : Text;
    heroSection : Section;
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
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can edit website content");
    };
    websiteContent := newContent;
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
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
