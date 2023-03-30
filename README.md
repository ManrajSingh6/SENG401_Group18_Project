# SENG401_Group18_Project
### SENG401 Group 18 Final Project - The Loop.

This web application is similar to Reddit, where users can create general discussion topics (threads) and create nested posts in such threads. Users can also interact with threads and posts along with a multitude of other functionalities. Explore the application to view more!


Completed by: Eric Wong, Manraj Singh, Aarushi Roy Choudhury, Farica Mago, Shanelle Li Chit Khim, Sajan Hayer, Jacob Adeyemo

View the deployed app here: https://seng401-the-loop.onrender.com/

**Important note when viewing the deployed version linked above:** For first time users or on initial load, the application may take 30-40 seconds to load the data from the backend (unfortunately this is not due to our code, but due to the Render.com deployment service and the free-tier deployment)

### Configuring the project:

In the root directory, create a folder called ``configs`` and inside the newly created folder, create a ``.env`` file with the **backend .env template** provided in the file ``environmentVariablesTemplate.txt``.

Inside the ``frontend`` directory, create another ``.env`` file with the **frontend .env template** provided in the file ``environmentVariablesTemplate.txt``.

Now you are finished configuring the environment variables for the application. Let's move onto installing the packages required.

### Installing the required dependencies:
In the root directory, enter:
``` npm install concurrently ```

Then in the ``backend`` directory, enter:

``` npm install ```

After the packages are done being installed, go to the ``frontend`` directory and enter the following:

``` npm i react-elastic-carousel --legacy-peer-deps ```

### Running the application:
In the root directory of the project, run:

``` npm run dev ```

