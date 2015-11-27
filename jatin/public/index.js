	var op = angular.module('Poll',['ngRoute']);	


	op.config(function($routeProvider) {
			$routeProvider

            // route for the home page
            .when('/', {
                templateUrl : '/adminCreate.html',
                controller  : 'control'
            })

            // route for the adminRun page
            .when('/adminRun', {
                templateUrl : '/adminRun.html',
                controller  : 'runController'
            })
			 .when('/User', {
                templateUrl : '/#/user.html',
                controller  : 'userController'
            })

           
		});
		
		op.controller("userController",function(dataService,$scope){
			
			$scope.userAnswers = [];
			$scope.submit = function(){
				
				$scope.userAnswers.push({"Qnumber":1,"resp":$scope.resp});
				dataService.userData = $scope.userAnswers ;
				
			}
			
		});
		
		op.controller("runController",function(dataService,$scope){
			if (dataService.StoredData == undefined )
			{
				
				$scope.empty="Oops! It seems you have not submitted any Q/A";
				
				
				
				}
				else{
			$scope.increment=0;
			$scope.question = dataService.StoredData[$scope.increment].ques;	
			$scope.answer = dataService.StoredDataA[$scope.increment].ans;
			
			$scope.nextQ =function(){
				
				$scope.increment = $scope.increment + 1; 
				$scope.question = dataService.StoredData[$scope.increment].ques;	
				$scope.answer = dataService.StoredDataA[$scope.increment].ans;
			}
			$scope.prevQ =function(){
				
				$scope.increment = $scope.increment - 1; 
				$scope.question = dataService.StoredData[$scope.increment].ques;	
				$scope.answer = dataService.StoredDataA[$scope.increment].ans;
			}
				}
		});






		op.controller("control",function(firstService,dataService,$scope,$http)
		{	
			 $scope.Questions=[];
			 $scope.Answers=[];
			 $scope.AnswersCopy=[];
			 $scope.count=0;
			 $scope.searchText ='';
			 $scope.temp='';
			 $scope.breakword = [];
			 $scope.count = 0 ;
			 $scope.Qno = 1;
			 $scope.indexValue = 0;
			  
			$scope.controllerFunction = function(search){
				
				$scope.filteredData=[];
				$scope.breakword = search.split(" ");
				console.log($scope.breakword);
				
				$scope.breakword[0] =   $scope.breakword[$scope.breakword.length - 1];
					
				for(i=0;i<firstService.details.length;i++) {
					
						if(firstService.details[i].words.indexOf($scope.breakword[0].toLowerCase()) != -1) {
							
							$scope.filteredData.push(firstService.details[i]);
						}
				}
				
				
			}
			
			
			$scope.controllerPush = function(search){
				
				
				
					
						if(($scope.filteredData.length > 0 )) {
					
							$scope.breakword = $scope.searchText.split(" ");
							
							if($scope.breakword[1] == undefined){
				
									$scope.searchText= $scope.filteredData[0].words;
									$scope.filteredData = [];
							}
							for ( i=2;i<=$scope.breakword.length;i++)
								{
									$scope.finale = "";
									if ($scope.breakword[i] == undefined )
										{
				
											for(j=0;j<= $scope.breakword.length - 2 ; j++)
											{
												
												$scope.finale = $scope.finale + " "  + $scope.breakword [j] 
			
											}
			
										}
									$scope.searchText = $scope.finale + " " + $scope.filteredData[0].words;
	
								}
							
						}
					
					
				console.log($scope.filteredData.length);
			}
			
			$scope.Store = function(){
				if ($scope.choice== "question"){
					if($scope.question==undefined && $scope.searchText!=""){
						
						
							$scope.Questions.push({ques:$scope.searchText,Qnumber:$scope.Qno,index:$scope.indexValue});
							$scope.question = $scope.Questions[$scope.indexValue].ques ;
							$scope.searchText="";
					
							$scope.indexValue = $scope.indexValue + 1;
							console.log($scope.question);
							$scope.demo = $scope.Questions[0];
							 
							 
							 $http.post('/api/opinions', $scope.demo)
								
								.success(function(data) {
								//$scope.Questions = {}; // clear the form so our user is ready to enter another
								$scope.opinions = data;
								console.log(data);
								})
								.error(function(data) {
								console.log('Error: ' + data);
									});
									
									
					}
					else if ($scope.searchText == "")
					{
						alert("Please type something to create a question!");
					}
					
					else
					{
						console.log($scope.question);
						console.log($scope.question);
						alert("You have already created a question!");
					}
					
					
				}
				else if ($scope.choice== "answer"){
					if($scope.searchText!=""){
							//$scope.Answers.push({index:$scope.count,Qnumber:$scope.Qno,ans:search});
							$scope.count = $scope.count + 1;
							$scope.AnswersCopy.push($scope.searchText);
							$scope.searchText="";
							for(i=0;i<$scope.AnswersCopy.length;i++)
							{
							console.log($scope.AnswersCopy[i])	;
							}
							$scope.Answers.push({Qnumber:$scope.Qno,ans:$scope.AnswersCopy})	;
							
				}}
					
				
				else{
					alert("please select an option");
				}
				
			}
			
			$scope.New = function(){
				if($scope.question!=undefined && $scope.AnswersCopy!=""){
					$scope.question = undefined;
					$scope.AnswersCopy = [];
					$scope.Qno = $scope.Qno + 1;
					dataService.StoredData = $scope.Questions;
					dataService.StoredDataA = $scope.Answers;
				}
				else if($scope.question==undefined) {
					alert("Please create a Question for your Answers");
				}
				else if( $scope.AnswersCopy=="") {
					alert("Please create Answers for your Question");
				}
			}	
			
			
			
			
		});
	
	op.directive('firstDirective',function()
			{
				return{
					restrict: 'E',
					scope: {
						viewData :'=',
						searchText :'=',
						controllerFunction:'&',
						controllerPush:'&'
					},
					template: '<div><input type="text" id="input" ng-model="searchText" placeholder="Let\'s start typing!" ng-enter="pushWord()" ng-change="directiveFunction()"></input><table id="table" ng-show="searchText"><tr></tr><tr ng-repeat="detail in viewData"><td>{{detail.words}}</td></tr></table><div>',
					
					link: function(scope,elements,attr)	{
						
					
						scope.pushWord = function (){
						
							if(scope.searchText.length = 1)
								{ scope.status=1;
						
								scope.controllerPush({search:scope.searchText});
									
								}
							};
						
						scope.directiveFunction = function (){
							
							
							console.log("Reaching directive function");
							if(scope.searchText != '')
								{ scope.status=0;
									console.log("i am inside if "+scope.searchText);
									
								scope.controllerFunction({search:scope.searchText});
								}
							};
						}
					};
			});
	
	op.directive('ngEnter', function () {
			return function (scope, element, attrs) {
				element.bind("keydown keypress", function (event) {
						if(event.which === 13) {
							scope.$apply(function (){
							scope.$eval(attrs.ngEnter);
							});
 
							event.preventDefault();
						}
					});
			};
		});
	
	op.factory('firstService',function()
	{
			var data ={ "details": [{words:"what"},{words:"me"},
						{words:"why" },{words:"when"},{words:"how" },{words:"where"},{words:"did"},
						{words:"enough"},{words:"the"},{words:"an"},{words:"this"},{words:"that "},{words:"are"},{words:"you"}, {words:"doing"},
						{words:"these"},{words:"those"},{words:"my"},{words:"his"},{words:"her"},{words:"its"},{words:"our"},
						{words:"their"},{words:"few"},{words:"little"},{words:"much"},{words:"many"},{words:"most"},{words:"some"}
 
			
			]} ;
			return data;
	});
		op.factory('dataService',function()
	{
			var StoredData = {};
			var StoredDataA = {};
			var userData = {};
			return StoredData;return StoredDataA;
			
	});
	

