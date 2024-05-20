import { db } from './firebase.js';

let blogId = decodeURI(location.pathname.split("/").pop());

let docRef = db.collection("blogs").doc( blogId);
const querySelector = addArticle;

docRef.get().then((doc) => {
  if(doc.exists){
    setupBlog(doc.data)
  }else{
    location.replace("/");
  }
})

const setupBlog = (data) => {
  const banner = document.querySelector('.banner');
  const blogTitle = document.querySelector('.title'); 
  const titleTag = document.querySelector('.title'); 
  const publish = document.querySelector('.published'); 
  

  banner.style.backgroundImage = `url($(data.bannerImage))`;

  titleTag.innerHTML += blogTitle.innerHTML = data.title
  publish.innerHTML += data.publishedAT;  
  publish.innerHTML += `-- ${data.author}`;  

  try {
    
     if(data.author == auth.currentUser.email.split('@')[0]){
     let editBtn = document.getElementById('edit-blog-btn');
     editBtn.style.display = "inline";
     editBtn.href= `${blogId}/editor`;
}
  } catch{
    // do nothing here
  }

  const article = document.querySelector('.article');
  addArticle(article, data.artricle);

}

const addArticle = (ele, data) => {
    data  = data.split("\n").filter(item => item.length);
    //console.log(data);

    data.forEach(item => {
      //chech for the heading
      if(item[0] == '#'){
        let hCount = 0;
        let i = 0;
        while(item[i] = '#'){
          hCount++;
          i++;
        }
        let tag = `h${hCount}`
        ele.innerHTML += `<${tag}>${item.slice(hCount, item.length)}</${tag  }>`
      }
          // checking for image format 
      else if(item[0] == "!" && item[1]== "["){
        let seperator;

        for(let i = 0; i <=item.length; i++){
          if(item[0] == "]" && item[i+1] == "(" && item[item.length - 1] ==
          ")"){
            separator = i;
          }
        }

        let alt = item.slice(2, seperator);
        let scr = item.slice(seperator + 2, item.length - 1);

        ele.innerHTML += `
        <img scr="${scr}" alt="${alt}" class=""article-image>
        `
      }
      else{
        ele.innerHTML += `<p>${item}</p>`;
      }
      
    })
}