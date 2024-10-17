<!DOCTYPE html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
    <link rel="stylesheet" href="${staticPublicPath}/built/girder_lib.min.css">
    <link rel="icon" type="image/png" href="${staticPublicPath}/built/plugins/histomicsui/favicon.png">
    % for plugin in pluginCss:
    <link rel="stylesheet" href="${staticPublicPath}/built/plugins/${plugin}/plugin.min.css">
    % endfor
    <link rel="stylesheet" href="${staticPublicPath}/built/extras/extra.css">
    <!-- TODO: In Girder 5 install tailwind the right way -->
    <script src="https://cdn.tailwindcss.com"></script>

    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: {
                            DEFAULT: 'hsl(var(--primary-h), var(--primary-s), var(--primary-l))',
                            hover: 'var(--primary-hover)',
                            content: 'var(--primary-content)',
                        },
                        secondary: {
                            DEFAULT: 'hsl(var(--secondary-h), var(--secondary-s), var(--secondary-l))',
                            hover: 'var(--secondary-hover)',
                            content: 'var(--secondary-content)',
                        },
                        accent: {
                            DEFAULT: 'hsl(var(--accent-h), var(--accent-s), var(--accent-l))',
                            hover: 'var(--accent-hover)',
                            content: 'var(--accent-content)',
                        },
                    },
                    zIndex: {
                        '100': '100',
                    },
                },
            },
            plugins: [],
            blocklist: ['collapse'], // disable because bootstrap uses it for something else
        };
    </script>

<style type="text/tailwindcss">
    @layer base {
        :root {
            /* User-defined hex values */
            --primary: ${bannerColor};
            --secondary: ${bannerColor};
            --accent: ${bannerColor};
        }

        body {
            @apply bg-zinc-100;
        }

        /* Typography Styles */
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
            @apply font-bold;
        }

        h1 {
            @apply text-4xl;
        }

        h2 {
            @apply text-3xl;
        }

        h3 {
            @apply text-2xl;
        }

        h4 {
            @apply text-xl;
        }

        h5 {
            @apply text-lg;
        }

        h6 {
            @apply text-base;
        }
    }

    @layer components {

        /*
        Define button styles:
            1. Sizes
            2. Colors
            3. Types
        */

        .htk-btn {
            @apply duration-200 ease-in-out inline-flex items-center justify-center px-3 py-[6px] rounded-md text-base tracking-wider transition-all gap-2 h-9;
        }

        .htk-btn i {
            @apply leading-[0];
        }

        /* 1. Sizes */

        .htk-btn.htk-btn-lg {
            @apply px-4 text-lg h-11;
        }

        .htk-btn.htk-btn-sm {
            @apply px-[10px] text-sm h-[30px] gap-1;
        }

        .htk-btn.htk-btn-xs {
            @apply px-[7px] rounded text-xs h-[22px] gap-1;
        }

        /* 2. Colors */

        .htk-btn.htk-btn-primary {
            @apply bg-primary text-primary-content;
        }

        .htk-btn.htk-btn-primary:hover {
            @apply bg-primary-hover;
        }

        .htk-btn.htk-btn-secondary {
            @apply bg-secondary text-secondary-content;
        }

        .htk-btn.htk-btn-secondary:hover {
            @apply bg-secondary-hover;
        }

        .htk-btn.htk-btn-accent {
            @apply bg-accent text-accent-content;
        }

        .htk-btn.htk-btn-accent:hover {
            @apply bg-accent-hover;
        }

        /* 3. Types
                a. Ghost
                b. Icon Only
                c. Disabled
        */

        /* a. Ghost */

        .htk-btn.htk-btn-ghost {
            @apply bg-neutral-800 bg-opacity-0;
        }

        .htk-btn.htk-btn-ghost:hover {
            @apply bg-opacity-10;
        }

        /* Primary Color */

        .htk-btn.htk-btn-primary.htk-btn-ghost {
            background-color: hsla(var(--primary-h), var(--primary-s), var(--primary-l), 0);
            @apply text-primary;
        }
        .htk-btn.htk-btn-primary.htk-btn-ghost:hover {
            background-color: hsla(var(--primary-h), var(--primary-s), var(--primary-l), 0.1);
        }

        /* Secondary Color */

        .htk-btn.htk-btn-secondary.htk-btn-ghost {
            background-color: hsla(var(--secondary-h), var(--secondary-s), var(--secondary-l), 0);
            @apply text-secondary;
        }
        .htk-btn.htk-btn-secondary.htk-btn-ghost:hover {
            background-color: hsla(var(--secondary-h), var(--secondary-s), var(--secondary-l), 0.1);
        }

        /* Accent Color */

        .htk-btn.htk-btn-accent.htk-btn-ghost {
            background-color: hsla(var(--accent-h), var(--accent-s), var(--accent-l), 0);
            @apply text-accent;
        }
        .htk-btn.htk-btn-accent.htk-btn-ghost:hover {
            background-color: hsla(var(--accent-h), var(--accent-s), var(--accent-l), 0.1);
        }

        /* b. Icon Only */

        .htk-btn.htk-btn-icon {
            /* "tracking-[0]" ensures icons are always centered when using icon fonts */
            @apply rounded-full !leading-none text-xl w-9 aspect-square tracking-[0];
        }

        /* Large */

        .htk-btn.htk-btn-icon.htk-btn-lg {
            @apply text-2xl w-11;
        }

        /* Small */

        .htk-btn.htk-btn-icon.htk-btn-sm {
            @apply text-lg w-[30px];
        }

        /* X-Small */

        .htk-btn.htk-btn-icon.htk-btn-xs {
            @apply text-sm w-[22px];
        }

        /* c. Disabled */
        .htk-btn.htk-btn-disabled {
            @apply bg-neutral-200 border border-neutral-300 text-neutral-400 !cursor-not-allowed;
        }

        /* Use this instead of Tailwind's hidden until we remove bootstrap */
        /* Required for now to account for the fact that bootstrap has !important on .hidden */
        .htk-hidden {
            display: none;
        }
    }
  </style>


  </head>
  <body>
    <div id="g-global-info-apiroot" class="hide">${apiRoot}</div>
    <div id="g-global-info-staticroot" class="hide">${staticPublicPath}</div>
    <script src="${staticPublicPath}/built/girder_lib.min.js"></script>
    <script src="${staticPublicPath}/built/girder_app.min.js"></script>
    <script>
    $(function () {
      $('body').addClass('hui-body');
      girder.router.enabled(false);
      girder.events.trigger('g:appload.before');
      var app = new girder.plugins.histomicsui.App({
        el: 'body',
        parentView: null,
        brandName: '${huiBrandName | js}',
        brandColor: '${huiBrandColor | js}',
        bannerColor: '${huiBannerColor | js}',
        helpURL: '${huiHelpURL | js}',
        helpTooltip: '${huiHelpTooltip | js}',
        helpText: '${huiHelpText | js}'
      });
      app.bindRoutes();
      girder.events.trigger('g:appload.after');
    });
    </script>
    % for plugin in pluginJs:
    <script src="${staticPublicPath}/built/plugins/${plugin}/plugin.min.js"></script>
    % endfor
  </body>
</html>
