
angular.module('submitExample', [])
.controller('IndexController', ['$scope', '$http', '$q', function($scope, $http) {
    
    $scope.init = function() {
        $http({ 
            url: 'http://localhost:8080/csvdata',
            method: "GET",
            params: {}
            }).then(function(response) {
                //console.log(response.data._data);
                $scope.csvdata = response.data;
                $scope.csvmap = new Map($scope.csvdata);
            });    
    };
    
    $scope.getURL = function(id){
        $scope.url = {};
        var uid = id.substr(id.lastIndexOf('/')+1); 
        return $scope.csvmap.get(uid);      
    };
       
    $scope.getSnippet = function(id) {
            var uid = id.substr(id.lastIndexOf('/')+1);
            //var deferred = $q.defer();
            $scope.snippet = [];
            return $http({ 
            url: 'http://localhost/GetSnippet.php',
            method: "GET",
            params: {file: uid, qs:$scope.text}
            }).then(function(response) {
                return response.data;
            });       
    };
    
    $scope.suggest = function() {
           if ($scope.text) {
            // First call solr to get autocomplete suggestions
            $http({ 
            url: 'http://localhost:8080/solrsuggest',
            method: "GET",
            params: {qs: $scope.text.toLowerCase()}
            }).then(function(response) {
                $scope.suggestions = [];
                
                var temp = response.data.suggestions;
                    
                for (var key in temp) {
                  if (temp.hasOwnProperty(key)) {
                      var word = temp[key].term;
                      if(/^[a-zA-Z0-9- ]*$/.test(word) == true)
                      {
                            $scope.suggestions.push(temp[key]);
                      }
                  }
                }
            });             
        }
        else {
            $scope.suggestions = [];
        }
    };
    
    $scope.setSelected = function(str) {
        var val = ($scope.text).lastIndexOf(" ") == -1 ? str 
                    : ($scope.text).substring(0, ($scope.text).lastIndexOf(" ")) + " " + str;
        document.getElementById('input1').value = val;
        $scope.suggestions = [];
    };
    
    $scope.submit = function() {
        $scope.suggestions = [];
        document.getElementById("spellcorrect").innerHTML = "";
        if ($scope.text) {
            // First call php to get the correct spelling
            $http({ 
            url: 'http://localhost/SpellCorrector.php',
            method: "GET",
            params: {word: $scope.text}
            }).then(function(response) {
                
                $scope.query = response.data;
                if ($scope.query.trim().toLowerCase() != $scope.text.trim().toLowerCase())
                {
                    document.getElementById("spellcorrect").innerHTML = "Did you mean: " + $scope.query;
                }
                
                $http({ 
                url: 'http://localhost:8080/solr',
                method: "GET",
                params: {qs: $scope.query, opt: $scope.radioValue}
                }).then(function(response) {
                    $scope.results = [];
                    $scope.results = response.data.docs;
                });
            });
        }
    };
}]);