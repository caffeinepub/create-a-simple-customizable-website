module {
  type Section = {
    sectionTitle : Text;
    sectionBody : Text;
  };

  type WebsiteContent = {
    siteTitle : Text;
    heroSection : Section;
    mainSection : Section;
    footerText : Text;
  };

  // Old actor state
  type OldActor = {
    websiteContent : WebsiteContent;
  };

  // New actor state
  type NewActor = {
    websiteContent : WebsiteContent;
  };

  public func run(old : OldActor) : NewActor {
    // Always set new default website content for migration
    {
      old with
      websiteContent = {
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
    };
  };
};
