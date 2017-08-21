var config = {
    app : {
        delay : process.env.POST_DELAY, //delay in minutes before new photo will be posted to Twitter
        mode: "gdrive", //google drive mode or local folder mode
        folder : "images" //folder of parent of photos
    },
    googleapi : {
        parent_folder : process.env.PARENT_FOLDER,
        api_key : process.env.DRIVE_API_KEY
    },
    twitter : {
        consumer_key : process.env.TWITTER_CONSUMER_KEY,
        consumer_secret : process.env.TWITTER_CONSUMER_KEY_SECRET,
        access_token : process.env.TWITTER_ACCESS_TOKEN,
        access_token_secret : process.env.TWITTER_ACCESS_TOKEN_SECRET
    }
}

module.exports = config