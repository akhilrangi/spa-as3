(function () {
	'use strict';

	angular.module('NarrowItDownApp', [])
	.controller('NarrowItDownController', NarrowItDownController)
	.service('MenuSearchService', MenuSearchService)
	.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
	.directive('foundItems', FoundItemsDirective);


function FoundItemsDirective() {
  var ddo = {
	templateUrl: 'foundItems.html'
	,
	scope: {
	  ngModel: '=',
	  foundData:'@'
	}
  };
  return ddo;
}

	NarrowItDownController.$inject = ['MenuSearchService'];
	function NarrowItDownController(MenuSearchService) {
		var narrow = this;

		narrow.narrowItDown = function () {
			
			narrow.found = MenuSearchService.getMatchedMenuItems(narrow.searchTerm);

			narrow.found.then(function (response) {
				console.log(response);
				narrow.foundData=response;				
			})
			.catch (function (error) {
				console.log(error);
			})
		};
		
		narrow.removeItem = function (itemIndex) {
			narrow.found.splice(itemIndex, 1);
		};
	}

	MenuSearchService.$inject = ['$http', 'ApiBasePath']
	function MenuSearchService($http, ApiBasePath) {
		var service = this;

		service.getMatchedMenuItems = function (searchTerm) {

			return $http({
				method: "GET",
				url: (ApiBasePath + "/menu_items.json")
			}).then(function (result) {				
				// process result and only keep items that match
				var foundItems = [];				
				angular.forEach(result.data.menu_items, function(item) {					
					if( item.description && item.description.indexOf(searchTerm) >= 0 )						
						foundItems.push(item);					
				});

				// return processed items
				return foundItems;
			});
		};
	}
})();
