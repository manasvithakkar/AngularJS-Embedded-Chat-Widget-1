# AngularJS-Embedded-Chat-Widget
Embed this chat widget into any website by including the following:
(Will add Angular directives for adding the CSS links and <script> tags dynamically in the next commit.)
CSS links: 
```
 <link href="bootstrap.min.css" rel="stylesheet"> 
 <link href="widget.css" rel="stylesheet>
 ```
 
JavaScript:
```
<script src = "mycontrol.js"></script> // Main angular code.
<script src="angular.min.js"></script>
<script src="socket.io-1.4.5.js"></script>
```
Inside Body:
```
<div  ng-controller = "chatCtrl" dynamic="html" class="chatWidget"></div>

```


