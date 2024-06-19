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


<img src ="https://github.com/gitgoap/AI-Snipping-Tool/assets/117789470/f1c582bc-2222-4d4f-8941-689da9e517cc" height= 500 >

</br></br>
`Step 3:` Fill *Google Gemini* API key and ask related *question*
<br>
Prerequisite: `Google Gemini API`

</br>



<img src ="https://github.com/gitgoap/AI-Snipping-Tool/assets/117789470/b92a1b58-6eb0-40cd-a88c-eb66aaa97550" height= 550 >




</br></br>
## Steps to get Gemini API key
 - Sign up at `https://ai.google.dev/aistudio`
 
   
 - Click on `Get API key`
<img src ="https://github.com/gitgoap/AI-Snipping-Tool/assets/117789470/9ae60e18-1966-4550-9ebc-59c468dec70c" height= 250 >


  </br></br>
## Built With

👉 Tech Stacks:
<p align="left">
 <a href="https://github.com/naptha/tesseract.js">
<img src="https://github.com/gitgoap/AI-Snipping-Tool/assets/117789470/759a7856-f060-4220-8337-1b3f582fb96f" height= 55>
     </a>
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





  </br>
  </br>
  </br>

  ## Getting Started 👩‍💻

> ⚠️Prerequisites
>
> - Recommended to have the latest version of Google Chrome
> - Make sure to switch on Chrome's `developer mode`


To get a local copy up and running follow these simple steps


### Installation

1. Open Git Bash and change directory
   
   ``` sh
   cd path
   ``` 
3. Clone the repo

```sh
 git clone https://github.com/gitgoap/AI-Snipping-Tool.git
```

3. Open Google Chrome

4. Click **3 dots** at top right corner

5. Go to Extensions>  Manage Extensions

6. Click **Load Unpack** and select the repo where you saved initially while cloning


<img src ="https://github.com/gitgoap/AI-Snipping-Tool/assets/117789470/3247e4fe-5c46-4c16-bb44-070753388f3c" height= 300 >



   </br></br></br>
   


## Contribution Guide
 - Make sure to raise an issue before raising a Pull Request.
 - Mention the issue number (`Eg: #4`) while raising a Pull Request in the description.
   
</br></br>
## Problem Statement

 We often need to type out text from videos, images, or thumbnails on websites. This can be a tedious and error-prone process, especially if the text is long or has tricky stuff like website links, technical words, code examples, or math equations. This issue comes up on YouTube, where useful info is shown in videos or thumbnail images.
 </br>
</br>
</br>
</br>

## Some of the scenarios where this problem arises:
</br>

</br>

<img src ="https://github.com/gitgoap/HackFest-24-IIT-Dhanbad/assets/117789470/325fe373-5215-4602-b582-1e2d3e91d96c" height= 300 >

- Manually typing the displayed link is inefficient and prone to errors.


</br>
</br>




<img src ="https://github.com/gitgoap/AI-Snipping-Tool/assets/117789470/947895f9-d606-46ba-bc63-ab3d75a8301b" height= 300 >

- Copying the references given in the presentation footer is difficult 

</br>



</br>

<img src ="https://github.com/meetalik8/AI-Snipping-Tool/assets/102135323/6082db70-8e32-47ae-b8fa-549540914088" height= 335 >

- Copying code directly to the editor  is not possible

</br>

</br>


<img src ="https://github.com/gitgoap/AI-Snipping-Tool/assets/117789470/bc090e17-f058-4649-986b-d70aac4fa3ee" height= 500 >

</br> 

- Copying text from documents shared as images on **social media** is tricky
- People may require this text to feed into LLMs to get a `summary`


</br>

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















 
 




