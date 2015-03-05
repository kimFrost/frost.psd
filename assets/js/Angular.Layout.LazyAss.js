var LazyAss = new namespace("LazyAss");


LazyAss.Angular.directive('lLazyAss',['$http', function($http) {
	return {
		restrict: 'C',
		scope: {},
		priority: 1000,
		controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
			console.log('------------------------------------------------------------------');
			console.log('------------------------- HUB Controller -------------------------');
			console.log('------------------------------------------------------------------');

			// Set default scope data
			$scope.data = {
				psdList: [],
				overlay: {
					metric: {
						left: 0,
						top: 0,
						width: 0,
						height: 0
					}
				},
				analyse: {
					fonts: [],
					colors: [],
					fontSizes: [],
					loading: false,
					snapshot: {
						img: "",
						loading: false
					}
				}
			};

			// Scope Functions
			$scope.reloadPsdList = function() {
				$http.get('/api/getPsdList').then(function(response){
					if (response.data != (null && undefined)) {
						$scope.data.psdList = [];
						for (var i=0;i<response.data.length;i++) {
							var psd = response.data[i];
							$scope.data.psdList.push({
								title: psd
							});
						}
					}
				});
			};
			$scope.loadPsd = function(psdTitle) {
				$scope.resetData();
				console.log('/api/getPsdData/:'+psdTitle);
				// Get png snapshot
				$scope.data.analyse.snapshot.loading = true;
				$scope.data.analyse.loading = true;
				$http.get('/api/getPsdPng/:'+psdTitle).then(function(response){
					$scope.data.analyse.snapshot.loading = false;
					if (response.data != null && response.data != undefined) {
						var png = response.data;
						png = png.replace("\\r", "").replace("\\n", "").replace(/["']/g, "");
						$scope.data.analyse.snapshot.img = png;
					}
				});
				// Get tree structure
				$http.get('/api/getPsdData/:'+psdTitle).then(function(response){
					$scope.data.analyse.loading = false;
					if (response.data != null && response.data != undefined) {
						var json = $.parseJSON(response.data);
						//var jsonObj = JSON.parse(json);
						var jsonObj = JSON.parse(JSON.stringify(json));
						console.log("jsonObj");
						console.log(jsonObj);
						$scope.processData(jsonObj);
					}
				});
			}
			$scope.resetData = function() {
				$scope.data.analyse = {
					fonts: [],
					colors: [],
					fontSizes: [],
					loading: false,
					snapshot: {
						img: "/",
						loading: false
					}
				};
			};
			$scope.processData = function(obj) {
				if (obj != null && obj != undefined) {
					// Analyse node
					if (obj.visible != false) {
						if (obj.text != undefined) {
							if (obj.text.font != undefined) {
								$scope.pushFont(obj.text, obj);
							}
						}
						// Loop through child nodes
						if (obj.children != undefined && obj.children.length > 0) {
							$.each(obj.children, function() {
								$scope.processData(this);
							});
						}
					}
				}
			};
			$scope.pushColor = function(dataColor) {
				//console.log(dataColor);
				$scope.data.analyse.colors.push(dataColor);
			};
			$scope.pushFontSize = function(dataFontSize) {
				//console.log(dataFontSize);
				$scope.data.analyse.fontSizes.push(dataFontSize);
			}
			$scope.pushFont = function(dataText, obj) {
				dataFont = dataText.font;
				var fonts = dataFont.name,
					css = dataFont.css,
					colors = dataFont.colors,
					fontSizes = dataFont.sizes,
					fontValue = dataText.value,
					metric = {
						top: obj.top,
						left: obj.left,
						width: obj.width,
						height: obj.height
					};

				if (!$.isArray(fonts)) {
					fonts = fonts.replace(/ /,"");
					fonts = [fonts];
				}

				var cssStyles = css.split(";");
				for (var i=0;i<cssStyles.length;i++) {
					var style = cssStyles[i];
					if (style.indexOf("font-family") != -1) {
						style = style.replace("font-family:","");
						var styleFonts = style.split(",");
						for (var m=0;m<styleFonts.length;m++) {
							var styleFont = styleFonts[m];
							styleFont = styleFont.replace(/ /,""); // remove spaces
							if (styleFont === "AdobeInvisFont") break;
							if ($.inArray(styleFont, fonts) == -1) {
								fonts.push(styleFont);
							}
						}
					}
				}

				$.each(colors, function() {
					var color = this;
					$scope.pushColor(color);
				});
				$.each(fontSizes, function() {
					var fontSize = this;
					$scope.pushFontSize(parseFloat(fontSize));
				});

				$scope.data.analyse.fonts.push({
					fonts: fonts,
					colors: colors,
					css: css,
					fontSizes: fontSizes,
					value: fontValue,
					metric: metric
				});
			};
			$scope.showOverlay = function(left, top, width, height) {
				console.log("showOverlay");
				if (!$scope.data.analyse.snapshot.loading && !$scope.data.analyse.loading)  {
					console.log(left, top, width, height);
					$scope.data.overlay.metric.left = left;
					$scope.data.overlay.metric.top = top;
					$scope.data.overlay.metric.width = width;
					$scope.data.overlay.metric.height = height;
				}
			};
			$scope.hideOverlay = function() {

			};

			// Directive Functions
			this.loadPsd = function() {
				console.log("controller load psd");
			};

		}],
		compile: function(tElement, tAttrs, transclude) {
			return {
				pre: function preLink(scope, iElement, iAttrs) {
					console.log('------------------------------------------------------------------');
					console.log('---------------------- HUB Pre CompileLink  ----------------------');
					console.log('------------------------------------------------------------------');

					/*
					 $http.get('data.json').then(function(response){
					 console.log(response.data);
					 scope.data.content = response.data.workspaces;
					 });
					 */
				},
				post: function postLink(scope, iElement, iAttrs) {
					console.log('------------------------------------------------------------------');
					console.log('---------------------- HUB Post CompileLink ----------------------');
					console.log('------------------------------------------------------------------');


				}
			}
		}
	}
}]);


/*
LazyAss.Angular.directive('lBodyNavPsd',['$http', function($http) {
	return {
		restrict: 'C',
		scope: {},
		require: "lLazyAss",
		priority: 1000,
		controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {

			// Set default scope data
			$scope.data = {};

			// Scope Functions
			$scope.loadPsd = function() {
				console.log("load psd");
			}

			// Directive Functions

		}],
		compile: function(tElement, tAttrs, transclude) {
			return {
				pre: function preLink(scope, iElement, iAttrs, controller) {

				},
				post: function postLink(scope, iElement, iAttrs, controller) {

				}
			}
		}
	}
}]);
*/