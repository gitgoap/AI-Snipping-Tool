# Overview

## ``` AI Snipping Tool ```

A **Chrome extension** that takes custom screenshots, **extracts text**, and allows users to **ask questions** from the extracted content. 

</br>

## Chrome Extension popup

`Step 1:` Take the screenshot
</br>
<img src ="https://github.com/gitgoap/AI-Snipping-Tool/assets/117789470/740449dd-f4e0-4b3f-b6f2-1985d3f295f0" height= 400 >
</br></br></br>
`Step 2:` Copy the *obtained text* or proceed further
</br>
<img src ="https://github.com/gitgoap/AI-Snipping-Tool/assets/117789470/8454baeb-2044-4c58-92ba-b66a30ed0055" height= 500 >

</br></br>
`Step 3:` Fill *Google Gemini* API key and ask related *question*
<br>
Prerequisite: `Google Gemini API`

</br>

<img src ="https://github.com/gitgoap/AI-Snipping-Tool/assets/117789470/11d6e728-8441-4586-8c73-bbd554d17ae4" height= 500 >




</br></br>
## Steps to get Gemini API key
 - Sign up at `https://ai.google.dev/aistudio`
 
   
 - Click on `Get API key`
<img src ="https://github.com/gitgoap/AI-Snipping-Tool/assets/117789470/9ae60e18-1966-4550-9ebc-59c468dec70c" height= 300 >


  </br></br>
## Built With

👉 Front-End Stacks:
<p align="left">
  <a href="](https://html.com">
    <img src="https://skillicons.dev/icons?i=html" />
  </a>
 <a href="https://www.css3.com">
    <img src="https://skillicons.dev/icons?i=css" />
  </a>

 <a href="https://www.javascript.com/">
    <img src="https://skillicons.dev/icons?i=js" />
  </a>

  
</p>

<a href="https://github.com/tesseract-ocr/tesseract">
 Tesseract OCR 
  </a>

  </br>
  </br>
  </br>

  ## Getting Started 👩‍💻

> ⚠️Prerequisites
>
> - Recommended to have the latest version of Google Chrome 


To get a local copy up and running follow these simple steps.


### Installation

1. Open Git Bash and change directory
   
   ``` sh
   cd path
   ``` 
3. Clone the repo

```sh
 git clone https://github.com/gitgoap/AI-Snipping-Tool_IIT-D_Hackathon.git
```

3. Open Google Chrome

4. Click **3 dots** at top right corner.

5. Go to Extensions>  Manage Extensions

6. Click **Load Unpack** and select the repo where you saved initially while cloning.


<img src ="https://github.com/gitgoap/AI-Snipping-Tool/assets/117789470/3247e4fe-5c46-4c16-bb44-070753388f3c" height= 300 >



   </br></br></br>
   


## Contribution Guide
 - Make sure to raise an issue before raising a Pull Request.
 - Mention the issue number (**Eg: #4**) while raising a Pull Request in the description.
   
</br></br>
## Problem Statement

 We often need to type out text from videos, images, or thumbnails on websites. This can be a tedious and error-prone process, especially if the text is long or has tricky stuff like website links, technical words, code examples, or math equations. This issue comes up on YouTube, where useful info is shown in videos or thumbnail images.
</br>
## Some of the scenarios where this problem arises:
<img src ="https://github.com/gitgoap/HackFest-24-IIT-Dhanbad/assets/117789470/325fe373-5215-4602-b582-1e2d3e91d96c" height= 300 >

### In the **MrBeast Riddle video**, he displays a YouTube link to visit as part of the riddle, but manually typing the link is inefficient and prone to errors.


</br>








<img src ="https://github.com/gitgoap/HackFest-24-IIT-Dhanbad/assets/117789470/1d84b1e5-6e1e-49b4-aefc-3482b74f29d6" height= 300 >

</br>

### Copying of code to the editor directly is not possible.


</br>







 #    Working

## Our Chrome extension is utilizing **Tesseract OCR** for character recognition in the image:
1. The extension's background script ```worker.js``` listens for user actions, such as clicking the extension's icon or using the context menu.
2. When the user initiates a screenshot, the extension captures the visible tab using ```chrome.tabs.captureVisibleTab``` and gets the screenshot data as a PNG image.
3. The extension then injects several scripts (```helper.js```, ```response.js```, ```elements.js```, and ```custom-elements.min.js```) into the current tab's context. These scripts are responsible for rendering the OCR result and handling the OCR process.
4. The ocr-result custom element, defined in ```elements.js```, is used to perform the OCR operation. This custom element utilizes the ```tesseract.js``` library, which is a pure **JavaScript port** of the **Tesseract OCR** engine.
5. The ocr-result element is configured with user preferences such as language, accuracy, and other settings fetched from the Chrome extension's local storage.
6. The captured screenshot data (PNG image) is passed to the **ocr-result element**, which then runs the **Tesseract OCR** engine on the image to extract the text.
7. The extracted text is rendered within the **ocr-result element**, allowing the user to view and interact with the OCR results.

 
</br>



> **Tesseract OCR**: It is an open-source optical character recognition (OCR) engine developed by Google. It is designed to extract text from images and documents without a text layer, outputting the document in various formats such as plain text, HTML, PDF, and more. **Tesseract** supports recognition of over **100 languages** "out of the box" and is highly customizable.

</br></br>

# Future Scope / Features

- **YouTube Video Screenshot:** Capture text in the current YouTube video frame with just one click of a popup button.
- **Download:** Users can save screenshots in their local system.

  


- Answers questions just with screenshots: This feature is possible by utilizing the multimodal feature of Google Gemini.

  ![image](https://github.com/gitgoap/HackFest-24-IIT-Dhanbad/assets/117789470/1592f070-2e07-436b-b268-dc25be5e8e53)


 
 
<h1 align = "center">Our Contributors ❤️</h2>
<div align = "center">
 <h3>Thank you for contributing to our repository</h3>

![Contributors](https://contrib.rocks/image?repo=gitgoap/AI-Snipping-Tool_IIT-D_Hackathon)

</div>















 
 




