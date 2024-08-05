# SnailyCadInstallDefaults

This website allows you to install the default values for [SnailyCAD](https://snailycad.org/) in a few clicks.

# Index

-   [How to use](#how-to-use)
-   [Installation](#installation)
    -   [Requirements](#requirements)
    -   [Installation](#installing)
-   [Contributing](#contributing)
    -   [Development](#development)
-   [License](#license)

<h1 id="how-to-use">How to use</h1>
Enter the URL of your SnailyCAD <b>API</b> in the API URL field.<br />
To get the API Key, you need to go to your SnailyCAD <b>client</b>, login as an admin, click on the <b>Admin</b> tab, <b>Cad Settings</b>, then finnaly find the <b>API Token</b> tab on the side bar. Lastly, <b>enable Public API Access</b> and click save. Then copy then API Token and paste it in the API Key field.<br />
Lastly, select the options you would like to install into your SnailyCAD and click the <b>Submit</b> button. It may take some time to import all of the values depending on the size of the items imported.

<h1 id="installation">Installation</h1>
<h3 id="requirements">Requirements</h3>
<ul>
    <li>Node.js & npm</li>
    <li>Unzip, or any other archive manager that can extract .zip files</li>
</ul>
<h3 id="installing">Installation</h3>
<ol>
  <li>Download the latest release from <a href="https://github.com/TheAFKGamer10/SnailyCadInstallDefaults/releases">the releases page</a></li>
    <li>Extract the files to a folder<br />
        <code>unzip SnailyCadInstallDefaults.zip</code></li>
    <li>Open the folder in your terminal<br />
        <code>cd SnailyCadInstallDefaults</code></li>
    <li>Install the dependencies<br />
        <code>npm install</code></li>
    <li>Start the server<br />
        <code>npm run start</code></li>
    <li>Open your browser and go to <a href="http://localhost:3007">http://localhost:3007</a></li>
</ol>

<h1 id="contributing">Contributing</h1>
If you would like to contribute to this project, please fork the repository and submit a pull request.
<h3 id="development">Development</h3>
<b>ONLY DO THIS IF YOU ARE A DEVELOPER AS THIS IS NOT NEEDED FOR THE AVERAGE INSTALLATION AND MAY CAUSE ISSUES</b><br />
To start the development server, run the following commands:
<ol>
    <li>Clone the repository<br />
        <code>git clone https://github.com/TheAFKGamer10/SnailyCadInstallDefaults.git</code></li>
    <li>Open the folder in your terminal<br />
        <code>cd SnailyCadInstallDefaults</code></li>
    <li>Install the dependencies<br />
        <code>npm install --save-dev</code></li>
    <li>Built the project<br />
        <code>npm run build</code></li>
        <li>Goto the <b>dist</b> folder<br />
        <code>cd dist</code></li>
    <li>Start the server<br />
        <code>npm run watch:server</code></li>
    <li>Open your browser and go to <a href="http://localhost:3007">http://localhost:3007</a></li>
</ol>

<h1 id="license">License</h1>
This project is licensed under the Creative Commons BY-NC-ND 4.0 License - see the [LICENSE.md](LICENSE.md) file for details.