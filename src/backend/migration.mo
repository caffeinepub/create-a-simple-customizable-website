import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
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

  public type UserProfile = { name : Text };

  public type OldActor = {
    websiteContent : WebsiteContent;
    userProfiles : Map.Map<Principal, UserProfile>;
  };
  public type NewActor = {
    draftContent : WebsiteContent;
    liveContent : WebsiteContent;
    userProfiles : Map.Map<Principal, UserProfile>;
  };

  public func run(old : OldActor) : NewActor {
    {
      draftContent = old.websiteContent;
      liveContent = old.websiteContent;
      userProfiles = old.userProfiles;
    };
  };
};
