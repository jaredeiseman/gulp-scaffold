# Setup Instructions
* Clone the repo
* Open package.json, change 'name' and any other applicable fields to your new projects information.
* Repeat the previous step for bower.json
* If using any CSS frameworks, in index.html uncomment the vendor.min.css link in the head
* If you plan to use bootstrap, in gulpfile.js, uncomment the labeled section on line 16, and comment out the previous line 15
* Use npm install, and bower install to install necessary dependencies
* Use gulp build to build js and css files to be included
* Use gulp serve to launch the development server

# Additional Notes
* In the JS folder there is an example module exported, and the -interface file using it. Feel free to use these as a template, but should be replaced and the files renamed.
