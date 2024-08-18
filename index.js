import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const app=express();
const PORT=8080;
const API_URL="https://api.jikan.moe/v4";
const NUM_ANIMES=18;

app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));




app.get("/",async (req,res)=>{
    try{
        //generating an array of Promises
        const AnimePromises=Array.from({length:NUM_ANIMES},()=>{
             return axios.get(`${API_URL}/random/anime?sfw=true`);
        })
        
        //wait for the promises to get resolved
        const results=await Promise.all(AnimePromises);
        
        const animes = results.map(result => result.data.data).filter(anime => !anime.explicit_genres.length);

        // console.log(animes[1]);
        res.render("index.ejs",{content:animes});

    }
    catch(error){
        console.log(`Error:${error.message}`);
    }
    
    
});

app.post("/search",async (req,res)=>{
    try{
        
        const result=await axios.get(`${API_URL}/anime?q=${req.body.anime}&sfw=true&`);
        console.log(result.data);
        if(result.data.data.length==0)
        {
            res.render("search.ejs");
        }
        else{
            res.render("search.ejs",{content:result.data.data});

        }
        


       
    }

    catch(error){
        console.log(error.message);
    }
})

app.post("/anime",async (req,res)=>{
    try{
       
        const animeData=await axios(`${API_URL}/anime/${req.body.animeID}`);
        const animeInfo=animeData.data.data;
        
        res.render("anime.ejs",{Info:animeInfo});
        console.log(animeInfo);


    }
    catch(error){
        console.log(error.message);
    }
   
})


app.listen(PORT,()=>{
    console.log(`Server running at port ${PORT}`);
})
