# Problem Statement

### We often need to type out text from videos, images, or thumbnails on websites. This can be a tedious and error-prone process, especially if the text is long or has tricky stuff like website links, technical words, code examples, or math equations. This issue comes up on YouTube, where useful info is shown in videos or thumbnail images.

## Some of the scenarios where this problem arises:
![Screenshot 2024-05-11 050941](https://github.com/gitgoap/HackFest-24-IIT-Dhanbad/assets/117789470/325fe373-5215-4602-b582-1e2d3e91d96c)

### In the MrBeast Riddle video, he displays a YouTube link to visit as part of the riddle, but manually typing the link is inefficient and prone to errors.





![Screenshot 2024-05-11 050949](https://github.com/gitgoap/HackFest-24-IIT-Dhanbad/assets/117789470/29019305-a63d-4443-89e8-2a67265befbe)

### A math lecture video full of complex equations in Laplacian notation. Typing or searching would be a total pain.


![image](https://github.com/gitgoap/HackFest-24-IIT-Dhanbad/assets/117789470/1d84b1e5-6e1e-49b4-aefc-3482b74f29d6)
<br>
### Copying of code to the editor directly is not possible.

# Proposed Solution
![main logo](https://github.com/gitgoap/HackFest-24-IIT-Dhanbad/assets/117789470/892a1b42-f677-455e-ac77-b9180198bf9f)
## We propose to develop a Chrome extension {AI Screenshot}:

- ### YouTube Video Screenshot: Capture text in the current video frame on the YouTube website. This will allow us to extract hyperlinks, code, complex equations, etc. 

- ### Full-page Screenshot: Capture the entire YouTube page with video, thumbnails, and descriptions.

- ### Custom Area Screenshot: Select any area of a webpage/video to screenshot. This will allow to extract images from a particular part of the image.

Webpage Summary: Summarize text from a screenshot capture of any webpage in the user-chosen language (MultiModal).
<br>
![Screenshot 2024-05-11 121827](https://github.com/gitgoap/HackFest-24-IIT-Dhanbad/assets/117789470/000736d9-2311-41ca-b9e3-30d530720bb6)
Working and Tech Stack


# Tech Stack
- HTML (frontend)
- Tailwind CSS (frontend)
- JavaScript (Backend)
- Postman (API testing)
- Google Gemini API (LLM (AI) application)








 #    Working

Our Chrome extension will send a POST request to the /gemini/ endpoint of the Google Gemini API. The request body will contain  base64-encoded data of the captured screenshot or image, allowing Google Gemini to extract all the text from the provided image data.
 All the extracted text will be sent back to the Chrome extension for display and coping.
Similarly, if the user chooses to summarize the webpage then it will also be done with the help of Google Gemini.


> About Google Gemini: Gemini is the latest and best Large Language Model developed by Google. It can perform any task related to natural language (text) and is also capable of code and image generation.
It also allows developers to use its API to develop AI apps as we proposed here.












 
 




