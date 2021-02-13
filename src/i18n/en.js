const en = {
    translation: {
        self: {
            abstract: 'A tool integrated with the Google Earth Engine platform capable of offering, in an accessible way, direct access to public data from international satellites, with sophisticated land use analysis capabilities in both space and time. Developed to meet the needs of scientists, managers and students, with a focus on the conservation of the planet Earth\'s natural resources.',
            poweredBy: 'Powered by: Google Earth Engine',
            imageryProvider: 'Imagery Providers: NASA (Landsat) and ESA (Sentinel)'
        },
        general: {
            loading: 'Loading...',
            cancel: 'Cancel'
        },
        auth: {
            signin: 'Sign in with Google',
            signout: 'Sign out',
            loading: 'Authenticating...'
        },
        forms: {
            acquisition: {
                title: 'Image Acquisition',
                prev: 'Return',
                next: 'Continue',
                '1': {
                    title: 'Choose satellite',
                    description: 'Select one of the available satellites for image acquisition.',
                    card: {
                        opticalResolution: 'Optical Resolution',
                        opticalResolutionUnit: 'meters',
                        activityPeriod: 'Activity Period',
                        provider: 'Provider',
                        revisitTime: 'Revisit time',
                        revisitTimeUnit: 'days',
                        choose: 'Choose'
                    }
                },
                '2': {
                    title: 'Set region of interest',
                    description: 'Draw the region of interest using the map below.',
                    showDelimiters: 'Show delimiters',
                    undo: 'Undo'
                },
                '3': {
                    title: 'Set period',
                    description: 'Use the time slider to specify the period of analysis.',
                    loading: 'Loading...',
                    period: 'Period',
                    to: 'to',
                    durationDays: 'days',
                    durationMonths: 'months',
                    durationYears: 'years',
                    imageQuantity: 'images',
                    cloudPercentage: 'Cloud percentage'
                },
                '4': {
                    title: 'Filter images',
                    description: 'Filter images to keep the appropriate images only.',
                    table: {
                        id: 'ID',
                        cloud: 'Clouds',
                        thumbnail: 'Thumbnail',
                        selected: 'Selected'
                    },
                    imagesPerPage: 'Images per page',
                    to: 'to',
                    of: 'of',
                    next: 'Complete'
                }
            },
            map: {
                roi: 'Area of interest',
                baseline: 'Baseline',
                shorelines: 'Shorelines',
                transects: {
                    title: 'Transects',
                    stable: 'Stable',
                    accreted: 'Accreted',
                    eroded: 'Eroded',
                    criticallyEroded: 'Critically Eroded'
                },
                item: {
                    s: 'item',
                    p: 'items'
                },
                cancel: 'Cancel'
            },
            imageChooser: {
                title: 'Available Imagery',
                resultQuantity: 'results',
                image: 'Image',
                load: 'Load',
                actions: {
                    title: 'Actions',
                    analyzeShoreline: {
                        title: 'Analyze Shoreline',
                        imageSelection: {
                            title: 'Select imagery',
                            cancel: 'Cancel',
                            confirm: 'Confirm'
                        },
                        baselineDraw: 'Draw baseline'
                    }
                }
            },
            shorelineParameters: {
                title: 'Input parameters',
                description: 'Define the transect spacing and extension, in meters, and input the threshold for land-water segmentation (0 = to automatic detection using Otsu thresholding method, -1 = automatic detection using multi-Otsu thresholding method',
                spacing: 'Spacing (m)',
                extension: 'Extension (m)',
                threshold: 'Threshold',
                cancel: 'Cancel',
                confirm: 'Confirm'
            },
            shorelineAnalysis: {
                title: 'Shoreline Analysis',
                transectsReport: {
                    title: 'Transects Report',
                    headers: {
                        id: 'ID',
                        initialLatitude: 'Latitude Begin',
                        initialLongitude: 'Longitude Begin',
                        finalLatitude: 'Latitude End',
                        finalLongitude: 'Longitude End',
                        initialDate: 'Date Begin',
                        finalDate: 'Date End',
                        intercept: 'Intercept',
                        slope: 'Slope',
                        rsquared: 'r²',
                        lrr: 'LRR',
                        sce: 'SCE',
                        nsm: 'NSM',
                        epr: 'EPR',
                        label: 'Class'
                    }
                },
                process: {
                    extraction: 'Extracting shorelines',
                    estimate: 'ETC'
                },
                exports: {
                    title: 'Export Data',
                    csv: 'Export CSV',
                    json: 'Export JSON',
                    shp: 'Export Shapefile'
                },
                close: 'Close'
            },
            transectEvolution: {
                statistics: 'Statistics',
                lrr: 'Rate of Change (LRR)',
                r: 'Correlation Coefficient (r)',
                sce: 'SCE',
                nsm: 'NSM',
                epr: 'EPR',
                label: 'Classification',
                units: {
                    meters: 'm',
                    mByYr: 'm/yr',
                    mByMonth: 'm/yr'
                },
                labels: {
                    x: 'Year',
                    y: 'Distance to baseline (m)',
                    trend: 'Trend'
                }
            },
            imageryOverlay: {
                base: 'Base',
                hint: 'New layer',
                loading: 'Loading',
                add: {
                    title: 'New layer',
                    name: 'Layer name',
                    expression: 'Expression',
                    bands: {
                        title: 'Available Bands',
                        red: 'RED: Red band',
                        green: 'GREEN: Green band',
                        blue: 'BLUE: Blue band',
                        nir: 'NIR: Near infrared band',
                        swir: 'SWIR: Shorwave infrared band'
                    },
                    suggested: 'Expressions',
                    create: 'Create'
                }
            }
        }
    }
}

export default en