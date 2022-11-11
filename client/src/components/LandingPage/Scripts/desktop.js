
    window._currentDevice = 'desktop';
    window.Parameters = window.Parameters || {
        AjaxContainer: 'div.dmBody',
        WrappingContainer: 'div.dmOuter',
        HomeUrl: 'http://app.multiscreensite.com/site/da53c60f',
        AccountUUID: '83f865a0dfd2448ba53d8b5db49db054',
        SystemID: 'US_DIRECT_PRODUCTION',
        SiteAlias: 'da53c60f',
        SiteType: atob('RFVEQU9ORQ=='),
        PublicationDate: 'Thu Nov 10 20:00:00 UTC 2022',
        ExternalUid: null,
        IsSiteMultilingual: false,
        InitialPostAlias: '',
        InitialDynamicItem: '',
        InitialPageAlias: 'home',
        InitialPageUuid: '2a79373b790d442aa86dd5a27309b590',
        InitialEncodedPageAlias: 'aG9tZQ==',
        CurrentPageUrl: '',
        IsCurrentHomePage: true,
        AllowAjax: false,
        AfterAjaxCommand: null,
        HomeLinkText: 'Back To Home',
        UseGalleryModule: false,
        CurrentThemeName: 'Layout Theme',
        ThemeVersion: '7815',
        DefaultPageAlias: '',
        RemoveDID: true,
        WidgetStyleID: null,
        IsHeaderFixed: false,
        IsHeaderSkinny: false,
        IsBfs: true,
        StorePageAlias: 'null',
        StorePagesUrls: 'e30=',
        IsNewStore: 'false',
        StorePath: '',
        StoreId: 'null',
        StoreVersion: 0,
        StoreBaseUrl: '/site/da53c60f?preview=true&dm_device=desktop&dm_exportSite=true&nossl&dm_exportSite_protected=396ae770_1668110437147_5_a71f3fcab427075f7ebe5d32d3e2088c8a923f3a36dbfad545e9523c4dee7a72',
        StoreCleanUrl: true,
        StoreDisableScrolling: true,
        IsStoreSuspended: false,
        NotificationSubDomain: 'null',
        HasCustomDomain: false,
        showCookieNotification: false,
        cookiesNotificationMarkup: 'null',
        translatedPageUrl: '',
        isFastMigrationSite: false,
        sidebarPosition: 'NA',
        currentLanguage: 'en',
        NavItems: '{}',
        errors: {
            general: 'There was an error connecting to the page.<br/> Make sure you are not offline.',
            password: 'Incorrect name/password combination',
            tryAgain: 'Try again'
        },
        NavigationAreaParams: {
            ShowBackToHomeOnInnerPages: true,
            NavbarSize: 4,
            NavbarLiveHomePage: 'http://app.multiscreensite.com/site/da53c60f',
            BlockContainerSelector: '.dmBody',
            NavbarSelector: '#dmNav:has(a)',
            SubNavbarSelector: '#subnav_main'
        },
        hasCustomCode: false,
        planID: '7',
        customTemplateId: 'null',
        siteTemplateId: 'null',
        productId: 'DM_DIRECT',
        disableTracking: false,
        pageType: 'FROM_SCRATCH',
        isRuntimeServer: true,
        siteInfo: null,
    };

    window.Parameters.LayoutID = {};
    window.Parameters.LayoutID[window._currentDevice] = 6;
    window.Parameters.LayoutVariationID = {};
    window.Parameters.LayoutVariationID[window._currentDevice] = 5;


    window.SystemID = 'US_DIRECT_PRODUCTION';

    if(!window.dmAPI) {
        window.dmAPI = {
            registerExternalRuntimeComponent: function() {
            },
            getCurrentDeviceType: function() {
                return window._currentDevice;
            }
        };
    }

    if (!window.requestIdleCallback) {
        window.requestIdleCallback = function (fn) {
            setTimeout(fn, 0);
        }
    }


(function () {
  let cssLinks = {};
  function loadCssLink(link) {
    link.onload = null;
    link.rel = "stylesheet";
    link.type = "text/css";
  }

  function checkCss() {
    if (cssLinks && cssLinks.runtime && cssLinks.global) {
      loadCssLink(cssLinks.runtime);
      loadCssLink(cssLinks.global);
      cssLinks = null;
    }
  }

  function loadCSS(link) {
    try {
      var urlParams = new URLSearchParams(window.location.search);
      var noCSS = !!urlParams.get("nocss");
      var cssTimeout = urlParams.get("cssTimeout") || 0;

      if (noCSS) {
        return;
      }
      if (link.href.includes("d-css-runtime")) {
        cssLinks.runtime = link;
        checkCss();
      } else if (link.id === "siteGlobalCss") {
        cssLinks.global = link;
        checkCss();
      } else {
        requestIdleCallback(function () {
          window.setTimeout(function () {
            loadCssLink(link);
          }, parseInt(cssTimeout, 10));
        });
      }
    } catch (e) {
      /* Never fail - this is just a tool for measurements */
    }
  }
  window.loadCSS = window.loadCSS || loadCSS;
})();


    /* usage: window.getDeferred(<deferred name>).resolve() or window.getDeferred(<deferred name>).promise.then(...)*/
    function Def(){this.promise=new Promise((function(a,b){this.resolve=a,this.reject=b}).bind(this))}
    const defs={};
    window.getDeferred=function(a){return null==defs[a]&&(defs[a]=new Def),defs[a]}
    window.waitForDeferred = function (b, a, c) {
      let d = window?.getDeferred?.(b);
      d
        ? d.promise.then(a)
        : c && ["complete", "interactive"].includes(document.readyState)
        ? setTimeout(a, 1)
        : c
        ? document.addEventListener("DOMContentLoaded", a)
        : console.error(`Deferred  does not exist`);
    };


(function () {
  let cssLinks = {};
  function loadCssLink(link) {
    link.onload = null;
    link.rel = "stylesheet";
    link.type = "text/css";
  }

  function checkCss() {
    if (cssLinks && cssLinks.runtime && cssLinks.global) {
      loadCssLink(cssLinks.runtime);
      loadCssLink(cssLinks.global);
      cssLinks = null;
    }
  }

  function loadCSS(link) {
    try {
      var urlParams = new URLSearchParams(window.location.search);
      var noCSS = !!urlParams.get("nocss");
      var cssTimeout = urlParams.get("cssTimeout") || 0;

      if (noCSS) {
        return;
      }
      if (link.href.includes("d-css-runtime")) {
        cssLinks.runtime = link;
        checkCss();
      } else if (link.id === "siteGlobalCss") {
        cssLinks.global = link;
        checkCss();
      } else {
        requestIdleCallback(function () {
          window.setTimeout(function () {
            loadCssLink(link);
          }, parseInt(cssTimeout, 10));
        });
      }
    } catch (e) {
      /* Never fail - this is just a tool for measurements */
    }
  }
  window.loadCSS = window.loadCSS || loadCSS;
})();
