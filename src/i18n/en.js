const en = {
  translation: {
    self: {
      title: "CASSIE",
      fullTitle: "Coastal Analyst System from Space Imagery Engine",
      shortDesc:
        "An open-source web tool for automatic shoreline mapping and analysis using satellite imagery.",
      abstract:
        "A tool integrated with the Google Earth Engine platform capable of offering, in an accessible way, direct access to public data from international satellites, with sophisticated land use analysis capabilities in both space and time. Developed to meet the needs of scientists, managers and students, with a focus on the conservation of the planet Earth's natural resources.",
      poweredBy: "Powered by: Google Earth Engine",
      imageryProvider: "Imagery Providers: NASA (Landsat) and ESA (Sentinel)",
    },
    home: {
      about: {
        title: "About",
      },
      instructions: {
        title: "CASSIE User Guide",
        text:
          "To use CASSIE, you must have a google account registered on the google earth engine platform.",
        btnEngineSingUp: "Register",
        btnManual: "User Guide",
        linkManual: "https://tinyurl.com/cassie-manual-en",
        btnVideo: "Instruction Video",
        linkVideo: "https://www.youtube.com/watch?v=7q-3xNVq0tY&",
      },
      baysqueeze: {
        title: "BAYSQUEEZE",
        text:
          'The project seeks to contribute with actions and results for the preservation of our planet, by assuming the task of fulfilling the United Nations Sustainable Development Goals, as well as attending the national needs of knowledge about climate change, in parallel with the goals of the sub-network "Coastal Zones", of the Brazilian Research Network on Global Climate Change (Rede Clima). ',
        btn: "Know more about the project",
      },
      riscport: {
        title: "RISCPORT",
        text:
          "The main goal of this project is to conduct a climate risk analysis (environmental and economic) and to determine possible adaptation measures, based on the future projection of environmental threats (e.g. storm waves), to increase the resilience of the port sector and adjacent areas in the Babitonga Bay, in an interdisciplinary and multi-institutional network context.",
        btn: "Know more about the project",
      },
      members: {
        title: "Team",
        roles: {
          researcher: "Researcher",
          coord: "Coordinator",
          atp: "Grant holder ATP-B",
          fumdes: "Grant holder FUMDES",
          capes: "CAPES DTI-B Fellow"
        },
      },
      papers: {
        title: "Publications",
        resumo_text: "Abstract in Proceedings",
        paper_text: "Paper in Journal",
        curso_text: "Workshop",
        more: "Learn More",
      },
      sponsor: {
        realiza: "Developed by",
        apoio: "Financial Support",
        apoio_desc: "CNPq MCTIC/CNPq – N° 21/2017; Process No. 441545/2017-3.",
        inst: "Institutional support",
        partners: "Project Partners",
      },
      footer: {
        social: "Social",
        copyright: "All rights reserved. System by",
        help: {
          title: "Help & Support",
          faq: "FAQ",
          discussion: "Discussions",
          problems: "Known Issues",
        },
        contact: {
          title: "Contact",
          manage: "Project Management",
          techquest: "Technical Questions",
        },
        resources: {
          title: "Resources",

          code: "Source Code",
        },
      },
      warning: {
        text: "CASSIE is still under development.",
        link: "See more",
      },
      cookies:{
        text: "Our website uses cookies to improve navigation.",
        link: "Ok",
      }
    },
    faq: {
      title: "Frequently Asked Questions",
      0: {
        title: "How does CASSIE works?",
        text:
          'CASSIE uses Google Earth Engine (GEE), a platform of parallel processing in geospatial data cloud (<a href="https://www.sciencedirect.com/science/article/pii/S0034425717302900" target="_blank">Gorelick et al., 2017</a>). CASSIE communicates with the GEE through an API (Application Programming Interface), which allows it to use the datasets and processing potential of the GEE.',
      },
      1: {
        title: "What satellite image datasets are available at CASSIE?",
        text:
          'Currently, CASSIE enables analysis with data from <a href="https://developers.google.com/earth-engine/datasets/catalog/COPERNICUS_S2" target="_blank">Sentinel 2 (MSI, TOA) Level-1C</a> and the Landsat collections (<a href="https://developers.google.com/earth-engine/datasets/catalog/LANDSAT_LT05_C01_T1_SR" target="_blank">Landsat 5 TM SR Tier 1</a>, <a href="https://developers.google.com/earth-engine/datasets/catalog/LANDSAT_LE07_C01_T1_SR" target="_blank">Landsat 7 ETM+ SR Tier 1</a>, <a href="https://developers.google.com/earth-engine/datasets/catalog/LANDSAT_LC08_C01_T1_SR" target="_blank">Landsat 8 OLI SR Tier 1</a>). When Tier 1 images (higher quality) aren\'t available for Landsat 7 and 8, CASSIE uses images from the <a href="https://developers.google.com/earth-engine/datasets/catalog/LANDSAT_LE07_C01_T2_TOA" target="_blank">Landsat 7 TOA Tier 2</a> and <a href="https://developers.google.com/earth-engine/datasets/catalog/LANDSAT_LC08_C01_T2_TOA" target="_blank">Landsat 8 TOA Tier 2</a>.',
      },
      2: {
        title: "How do I access CASSIE?",
        text:
          'CASSIE is available as an open source tool, available at <a href="http://cassie-stable.herokuapp.com/">this link</a>. The user needs a <a href="https://myaccount.google.com">Google account</a> registered (and approved) on <a href="https://signup.earthengine.google.com">Google Earth Engine plataform</a>. CASSIE\'s code is available at <a href="https://github.com/lia-univali/cassie">LIA\'s Github - Univali.',
      },
      3: {
        title:
          "When I sign in with my Google Account, the page loads up indefinitely",
        text:
          'To access and use CASSIE, the user account must be registered on the Google Earth Engine (GEE) platform. The registration can be done through this <a href="https://earthengine.google.com/signup/" target="_blank">link</a>. Once the registration is confirmed, the user can access and sign in to CASSIE with your Google account.',
      },
      4: {
        title:
          "My account is registered in Google Earth Engine, but I still can't access the tool",
        text:
          'Registration on the Google Earth Engine platform is terminated with a confirmation received via email. In some cases, the confirmation email is received instantly after the registration is made. However, confirmation is not always instantaneous and can take time that the CASSIE team has no control over. If the user has made the registration and has not yet received the confirmation email, and considers that the waiting time is too long, the user should contact the <a href="https://developers.google.com/earth-engine/help">Google Earth Engine team</a>. If the user cannot enter even after confirmation, it is recommended to <a href="https://support.google.com/accounts/answer/32050?co=GENIE.Platform%3DDesktop&hl=en" target="_blank">clear the browser cookies.',
      },
    },
    problems: {
      title: "Known Issues",
      text:
        "CASSIE is still under development, some processes may fail. These are some known issues.",
      0: {
        title: "BigData Analysis ",
        text:
          "Sometimes CASSIE Can't perform large analyses, with large region or with many images.",
      },
    },
    general: {
      loading: "Loading...",
      cancel: "Cancel",
    },
    auth: {
      signin: "Sign in with Google",
      signout: "Sign out",
      loading: "Authenticating...",
    },
    forms: {
      acquisition: {
        title: "Image Acquisition",
        prev: "Return",
        next: "Continue",
        1: {
          title: "Choose satellite",
          description:
            "Select one of the available satellites for image acquisition.",
          card: {
            opticalResolution: "Optical Resolution",
            opticalResolutionUnit: "meters",
            activityPeriod: "Activity Period",
            provider: "Provider",
            revisitTime: "Revisit time",
            revisitTimeUnit: "days",
            choose: "Choose",
          },
        },
        2: {
          title: "Set region of interest",
          description: "Draw the region of interest using the map below.",
          showDelimiters: "Show delimiters",
          undo: "Undo",
        },
        3: {
          title: "Set period",
          description: "Use the time slider to specify the period of analysis.",
          loading: "Loading...",
          period: "Period",
          to: "to",
          durationDays: {
            singular: "day",
            plural: "days",
          },
          durationMonths: {
            singular: "month",
            plural: "months",
          },
          durationYears: {
            singular: "year",
            plural: "years",
          },
          imageQuantity: {
            singular: "image",
            plural: "images",
          },
          cloudPercentage: "Cloud percentage",
        },
        4: {
          title: "Filter images",
          description: "Filter images to keep the appropriate images only.",
          table: {
            id: "ID",
            cloud: "Clouds",
            thumbnail: "Thumbnail",
            selected: "Selected",
          },
          imagesPerPage: "Images per page",
          to: "to",
          of: "of",
          next: "Complete",
        },
      },
      map: {
        roi: "Area of interest",
        baseline: "Baseline",
        shorelines: "Shorelines",
        transects: {
          title: "Transects",
          stable: "Stable",
          accreted: "Accreted",
          eroded: "Eroded",
          criticallyEroded: "Critically Eroded",
        },
        item: {
          s: "item",
          p: "items",
        },
        cancel: "Cancel",
      },
      imageChooser: {
        title: "Available Imagery",
        resultQuantity: "results",
        image: "Image",
        load: "Load",
        actions: {
          title: "Actions",
          analyzeShoreline: {
            title: "Analyze Shoreline",
            imageSelection: {
              title: "Select imagery",
              cancel: "Cancel",
              confirm: "Confirm",
            },
            baselineDraw: "Draw baseline",
          },
        },
      },
      shorelineParameters: {
        title: "Input parameters",
        description:
          "Define the transect spacing and extension, in meters, and input the threshold for land-water segmentation (0 = to automatic detection using Otsu thresholding method, -1 = automatic detection using multi-Otsu thresholding method",
        spacing: "Spacing (m)",
        extension: "Extension (m)",
        threshold: "Threshold",
        cancel: "Cancel",
        confirm: "Confirm",
      },
      shorelineAnalysis: {
        title: "Shoreline Analysis",
        transectsReport: {
          title: "Transects Report",
          headers: {
            id: "ID",
            initialLatitude: "Latitude Begin",
            initialLongitude: "Longitude Begin",
            finalLatitude: "Latitude End",
            finalLongitude: "Longitude End",
            initialDate: "Date Begin",
            finalDate: "Date End",
            intercept: "Intercept",
            slope: "Slope",
            rsquared: "r²",
            lrr: "LRR",
            sce: "SCE",
            nsm: "NSM",
            epr: "EPR",
            label: "Class",
          },
        },
        process: {
          extraction: "Extracting shorelines",
          estimate: "ETC",
        },
        exports: {
          title: "Export Data",
          csv: "Export CSV",
          json: "Export JSON",
          shp: "Export Shapefile",
        },
        close: "Close",
      },
      transectEvolution: {
        statistics: "Statistics",
        lrr: "Rate of Change (LRR)",
        r: "Correlation Coefficient (r)",
        sce: "SCE",
        nsm: "NSM",
        epr: "EPR",
        label: "Classification",
        units: {
          meters: "m",
          mByYr: "m/yr",
          mByMonth: "m/yr",
        },
        labels: {
          x: "Year",
          y: "Distance to baseline (m)",
          trend: "Trend",
        },
      },
      imageryOverlay: {
        base: "Base",
        hint: "New layer",
        loading: "Loading",
        add: {
          title: "New layer",
          name: "Layer name",
          expression: "Expression",
          bands: {
            title: "Available Bands",
            red: "RED: Red band",
            green: "GREEN: Green band",
            blue: "BLUE: Blue band",
            nir: "NIR: Near infrared band",
            swir: "SWIR: Shorwave infrared band",
          },
          suggested: "Expressions",
          create: "Create",
        },
      },
    },
  },
};

export default en;
