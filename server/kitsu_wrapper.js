const req = require('request');

class KitsuAPIWrapper {

    

    constructor(){

        this.request = req.defaults({            
            "headers": {
                "Accept": "application/vnd.api+json",
                "Content-Type": "application/vnd.api+json"
            }
        });

        this.baseUrl = 'https://kitsu.io/api/edge/'
    }


    getAnime(pattern){

        let url = undefined;
        let querry = undefined;

        if(!isNaN(pattern)){
            url = this.baseUrl + 'anime/' + pattern;
        }else{
            url = this.baseUrl + 'anime';
            querry = { 'filter[text]': pattern, 'include' : 'genres,categories' };
        }

        //console.log(url);

        return new Promise((resolve, reject) => {
            
            this.request.get({ uri : url, qs : querry}, (err, res, body) => {

                console.log("Done Getanime")

                if(err){
                    return reject(err);
                }else{
                    return resolve(JSON.parse(body).data);
                }

                
            });
        });

    }

    getGenres(animeObj){
        
        let url = animeObj.relationships.genres.links.related;

        return new Promise((resolve, reject) => {
            
            this.request.get({ uri : url}, (err, res, body) => {

                //console.log("Done GetGenres")

                if(err){
                    return reject(err);
                }else{
                    
                    let data = JSON.parse(body).data;
                    let genreList = data.map(genre => {return genre.attributes.name});
                    //console.log(genreList);
                    
                    animeObj.genreList = genreList;

                    //console.log(animeObj.genreList);

                    return resolve(animeObj);
                }
                
            });
        });
    }


    getCategories(animeObj){
        
        

        let url = animeObj.relationships.categories.links.related;

        return new Promise((resolve, reject) => {
            
            this.request.get({ uri : url}, (err, res, body) => {

                //console.log("Done GetGenres")

                if(err){
                    return reject(err);
                }else{
                    
                    let data = JSON.parse(body).data;
                    let categoryList = data.map(category => {return category.attributes.title});
                    console.log(categoryList);

                    animeObj.categoryList = categoryList;


                    //console.log(animeObj.categoryList);

                    return resolve(animeObj);
                }
                
            });
        });
    }

}

module.exports = KitsuAPIWrapper;