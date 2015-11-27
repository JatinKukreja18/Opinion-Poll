	var op = angular.module('Poll',['ngRoute']);	


	op.config(function($routeProvider) {
			$routeProvider

            // route for the home page
            .when('/', {
                templateUrl : '/loginPage.html',
                controller  : 'loginController'
            })
			

            // route for the adminRun page
            .when('/admin', {
                templateUrl : '/adminCreate.html',
                controller  : 'control'
            })
			
			
			.when('/adminRun', {
                templateUrl : '/adminRun.html',
                controller  : 'runController'
            })
			 .when('/user', {
                templateUrl : '/user.html',
                controller  : 'userController'
            })

           
		});
		
		
		op.controller("loginController",function($scope,$http,currentUser){
			
			
			$scope.info=[];
			console.log(currentUser.currentUser);
			$scope.submit =function(){
				
				
				$http.get('/api/logins')
						.success(function(data) {
					$scope.user = data;
					
					for(i=0;i< $scope.user.length ;i++){					
						if($scope.user[i].ID == $scope.username && $scope.password== $scope.user[i].password && $scope.user[i].isAdmin == true)
						{
							console.log(currentUser.currentUser);
							$scope.address = '/#/admin';
							
							currentUser.currentUser = $scope.user[i].ID;
							console.log($scope.user[i].ID);
							
						}
						else if($scope.user[i].ID == $scope.username && $scope.password== $scope.user[i].password && $scope.user[i].isAdmin == false)
						{
							$scope.address = '/#/user';
							currentUser.currentUser = $scope.username;
							
						}
					}	
				})
				.error(function(data) {
					console.log('Error: ' + data);
					});
					
				
			}		
					

			
			
				});
		op.controller("userController",function($scope,$http,currentUser){
			
			$scope.userAnswers = [];
			$scope.answers=[];
			
			$scope.submit = function(){
				
				$scope.userAnswers.push({"Qnumber":1,"resp":$scope.resp});
				$scope.resp="";
				console.log($scope.userAnswers);
			}
				$http.get('/api/opinions')
				.success(function(data) {
					$scope.opinions = data;
					$scope.AllQ=[];
					
					for(i=0;i<$scope.opinions.length;i++){
					
							$scope.AllQ[i] = ($scope.opinions[i].questionaire + " " + "by" + " " +$scope.opinions[i].user);
							console.log($scope.opinions[i].questionaire);
							console.log($scope.AllQ);
							
			
						}
						console.log($scope.opinions);
				$scope.Back = function(){
					
							$scope.Chosen = undefined ;
				
				}
				
				$scope.submit = function(){
						
				/*	$http.post('/api/answers', $scope.)
								.success(function(data) {
								$scope.answers = data;
								console.log(data);
								})
								.error(function(data) {
								console.log('Error: ' + data);
									});*/
				}
				$scope.ChosenQ = function(data){
					
							$scope.Chosen = data ;
							console.log($scope.Chosen);
				
				
				
					if ($scope.opinions[0] == undefined )
					{	
						$scope.empty="Oops! It seems there are no Questions.";
					}
					else{
						for(i=0;i<$scope.opinions.length;i++){
						
							console.log($scope.opinions[i].questionaire+ " " + "by" + " " +	$scope.opinions[i].user);
							console.log($scope.Chosen);
							
							if(($scope.opinions[i].questionaire+ " " + "by" + " " +	$scope.opinions[i].user)==$scope.Chosen)
							{
								console.log($scope.opinions[i].questionaire+ " " + "by" + " " +	$scope.opinions[i].user);
							console.log($scope.Chosen);
							$scope.j = i ;
							}
						}
						
							$scope.increment=0;
							$scope.question = $scope.opinions[$scope.j].col[$scope.increment].ques;	
							$scope.answers = $scope.opinions[$scope.j].col[$scope.increment].ans;
							$scope.loggedIn = $scope.opinions[$scope.j].user;
						
						$scope.nextQ =function(){
								if ($scope.increment!=($scope.opinions[$scope.j].col.length - 1)){
										$scope.increment = $scope.increment + 1; 
								$scope.question = $scope.opinions[$scope.j].col[$scope.increment].ques;	
								$scope.answers = $scope.opinions[$scope.j].col[$scope.increment].ans;
					
								}
								else{
								alert("Last Question!");
								}
							}
						
						$scope.prevQ =function(){
							if ($scope.increment > 0){
							$scope.increment = $scope.increment - 1; 
							$scope.question = $scope.opinions[$scope.j].col[$scope.increment].ques;	
							$scope.answers = $scope.opinions[$scope.j].col[$scope.increment].ans;
								
							}	
							
									else{
								alert("First Question!");
								}
						}
					
						
					
					
					}
				}
					
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});
			
			
		});
		
		op.controller("runController",function($scope,$http,currentUser){
					 // when landing on the page, get all todos and show them
			$scope.opinions = [];
			$scope.questionaireName = "";
			$scope.AllQ =[];
			$scope.AllCount = 0;
			$http.get('/api/opinions')
				.success(function(data) {
					$scope.opinions = data;
					console.log($scope.opinions);
				if ($scope.opinions[0] == undefined )
				{	
				$scope.empty="Oops! It seems you have not submitted any Q/A";
				}
				else {
					
					
						for(i=0;i<$scope.opinions.length;i++){
					
							if($scope.opinions[i].user == currentUser.currentUser){
								
							$scope.AllQ[$scope.AllCount] = $scope.opinions[i].questionaire;
							console.log($scope.opinions[i].questionaire);
							console.log($scope.AllQ);
							$scope.AllCount = $scope.AllCount + 1; 
							}
			
						}
					
						$scope.ChosenQ = function(data){
					
							$scope.Chosen = data ;
							console.log($scope.Chosen);
						
							for(i=0;i<$scope.opinions.length;i++)
							{
							
								if($scope.opinions[i].questionaire == $scope.Chosen)
								{
								
									for(j=0;j<= $scope.opinions[i].col.length - 1;j++)
										{
										$scope.bunch = $scope.opinions[i].col;	
										console.log($scope.bunch);
										$scope.questionaireName = $scope.opinions[i].questionaire;	
										$scope.answer = $scope.opinions[i].col[j].ans;
							
										}
								}
							}
						
						}
					
					}
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});
				
			
				
				
			
		});






		op.controller("control",function(firstService,$scope,$http,currentUser)
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
			 $scope.flag = -1 ; 
			 $scope.QA=[];
			 $scope.Collection=[];
			 
			 $scope.loggedIn = currentUser.currentUser;
			 $scope.Next = function(){
				 if($scope.questionaireName!=undefined)
				 {
					 $scope.click = 4;
				 $scope.Questionaire = $scope.questionaireName ;
				 }
				 else{
					 alert("please enter a name");
				 }
			 }
			 
			$scope.clicked = function(){
				
				$scope.click = 2;
			};
			
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
			
			$scope.Back = function(a){
						
						if(a==1){
							$scope.click = undefined ;
						}
						else if(a==2){
							$scope.Questionaire=undefined;
							$scope.click = 2;
						}
				}

			$scope.controllerKey = function($event){
				
				if ($event.keyCode == 38){
					console.log("up arrow");
				
				$scope.flag = $scope.flag - 1 ; 
				$scope.activeIndex = $scope.flag;}
				else if ($event.keyCode == 40){
					console.log("down arrow");
				if($scope.flag < ($scope.filteredData.length - 1)){$scope.flag = $scope.flag + 1 ;
			console.log($scope.flag);
			$scope.activeIndex = $scope.flag;
			console.log($scope.activeIndex);
				}
			}
			}
			$scope.controllerPush = function(search){
					
				
				
					
						if(($scope.filteredData.length > 0  )) {
					
							$scope.breakword = $scope.searchText.split(" ");
							
							if($scope.breakword[1] == undefined){
				
									$scope.searchText= $scope.filteredData[$scope.flag].words;
									$scope.filteredData = [];
									$scope.flag = -1 ;
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
									
									$scope.searchText = $scope.finale + " " + $scope.filteredData[$scope.flag].words;
									//$scope.flag = -1 ;
	
								}
							
							
						}
						$scope.flag = -1 ;
						$scope.activeIndex = -1 ;
				
				
			}
			
			$scope.Store = function(){
				if ($scope.choice== "question"){
					if($scope.question==undefined && $scope.searchText!=""){
							$scope.question = $scope.searchText;
							$scope.searchText="";
					}
					else if ($scope.searchText == "")
					{
						alert("Please type something to create a question!");
					}
					
					else
					{
						
						alert("You have already created a question!");
					}
				}
				else if ($scope.choice== "answer"){
					if($scope.searchText!=""){
				
							$scope.count = $scope.count + 1;
							$scope.AnswersCopy.push($scope.searchText);
							$scope.searchText="";
				}}
				else{
					alert("please select an option");
				}
				
			}
			$scope.submitQ	= function(){
				
					console.log(currentUser.currentUser);
			
					$scope.QA={user:currentUser.currentUser,questionaire:$scope.Questionaire,collection:$scope.Collection};
					console.log($scope.Collection);
					console.log($scope.QA);
				
					$http.post('/api/opinions', $scope.QA)
								.success(function(data) {
								$scope.opinions = data;
								console.log(data);
								})
								.error(function(data) {
								console.log('Error: ' + data);
									});
					$scope.Collection = [];
				
			}
			
			$scope.New = function(){
				if($scope.question!=undefined && $scope.AnswersCopy!=""){
							$scope.Collection.push({ques:$scope.question,Qnumber:$scope.Qno,ans:$scope.AnswersCopy});
							console.log($scope.Collection);
							$scope.question = undefined;				
							$scope.AnswersCopy = [];
				$scope.Qno = $scope.Qno + 1;}
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
						controllerPush:'&',
						controllerKey:'&',
						activeIndex:'='
					},
				template: '<div><input type="text" id="input" ng-model="searchText" placeholder="Let\'s start typing!" ng-keydown="key($event)" ng-enter="pushWord()" ng-change="directiveFunction()"></input><ul style="list-style-type:none" id="table" ng-show="searchText"><li ng-class="{highlight:$index==activeIndex}" ng-repeat="detail in viewData">{{detail.words}}</li></ul><div>',
					
					link: function(scope,elements,attr)	{
						
					
						scope.pushWord = function (){
						
							if(scope.searchText.length = 1)
								{ scope.status=1;
								
								scope.controllerPush({search:scope.searchText});
									
								}
							};
						
						scope.key =  function($event){
							
							console.log($event.keyCode);
							scope.controllerKey({$event});
						};
						
						scope.directiveFunction = function (){
							
							
							
							if(scope.searchText != '')
								{ scope.status=0;

									
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
		op.factory('currentUser',function()
	{
			 var cU = {	currentUser : null};
	
			return cU;
			
	});
	

