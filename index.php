#!/usr/bin/php
<html ng-app="ssas">
  <head>
    <title>Secret Santa Allocation System (SSAS)</title>
    <link rel="icon" type="image/x-icon" href="http://lh4.ggpht.com/-W-faUid9Zcs/Tujz1ybAF1I/AAAAAAAAJC0/RbVRgCC8YSY/Flying-Songbird_thumb.png?imgmax=800"/>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
    <link rel="stylesheet" href="./css/index.css">
    <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular.min.js"></script>
    <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular-route.min.js"></script>
    <script src="./js/controllers.js"></script>
  </head>
  <body ng-controller="indexController">
    <section class="container">
      <header class="jumbotron">
        <div class="filter">
          <h1><u>S</u>ecret <u>S</u>anta <u>A</u>llocation <u>S</u>ystem</h1>
          <h2>SSAS</h2>
        </div>
      </header>
<?php /** login page **/ ?>
      <main ng-hide="target">
        <div class="row">
          <div class="col-sm-2">
          </div>
          <div class="col-sm-8">
<p>
            A Christmas is not Christmas without giving or recieving gifts. You are going to be someone's secret santa and buy a gift for him/her. Relax, someone is going to be your secret santa too! Login to see who you are going to buy gift to!
</p>
<p>
The budget of this year's gift is around <strong>&pound;10</strong>.
</p>
<p>
Current statistics:<br>
People who has logged in and found out their master: <strong>{{stat.numberOfPeopleLoggedIn}}/{{stat.numberOfPeople}}</strong><br>
</p>
            <hr>
            <form>
              <div class="form-group">
                <label for="person">Your name</label>
                <select id="person" class="form-control" ng-model="id" ng-options="person.name for person in people | orderBy: 'name' track by person.id">
                </select>
              </div>

              <div class="form-group">
                <label for="password">Your password</label>
                <input class="form-control" id="password" type="password" ng-model="password">
                <p class="help-block">If you have never login before, this is where you set up your password.<br>
                This is to make sure no other people peek who your master is.<br>
                Although passwords are encrypted, try to AVOID using any of your common passwords as this system might be quite insecure.</p>
              </div>

              <div class="form-group">
                <input type="checkbox" id="confirm" ng-model="confirm">
                <label for="confirm">I am the selected person. And I promise not to cheat/hack/whatever to ruin the game. :p</label>
              </div>

              <button class="btn btn-danger" ng-click="login()">Tell me my master!</button>
              <span class="text-danger">{{errormsg}}</span>
            </form>
          </div>
          <div class="col-sm-2">
          </div>
        </div>
      </main>
<?php /** result page **/?>
      <main ng-if="target">
        <h2>You are the secret santa of:</h2>
        <h5>You are going to buy a gift for him/her and bring it to him/her at the Christmas dinner.</h5>
        <div class="row">
          <div class="col-sm-5">
            <div id="snow_frame">
            </div>
              <img ng-src="{{target.image}}" width="100%"></img>
          </div>
          <div class="col-sm-7">
            <div class="row">
              <div class="col-sm-2">
                Name
              </div>
              <div class="col-sm-10">
                {{target.name}}
              </div>
              <div class="col-sm-2">
                Facebook
              </div>
              <div class="col-sm-10">
                <a target="_blank" href="http://www.facebook.com/{{target.facebook}}">www.facebook.com/{{target.facebook}}</a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer>
        
        <div class="text-right"> <em>This project is open source. Available on <a href="https://github.com/ycmjason/mbssas" target="_blank">github</a>.</div>
        <div class="text-right"> <em>All built from scratch by <a href="//facebook.com/ycm.jason" target="_blank">Jason Yu</a> &copy;.</em></div>
      </footer>
    </section>
  </body>
</html>
