
import Video from '../models/Video.js';

export const home = async (req, res) => { 
    /* 
    // 방법 1: Callback 방식
    Video.find({}, (err, videos) => {
        console.log('ERROR ::: ', err);    
        return res.render('home', {title: 'Home', videos});
    });
    */
   
    // 방법 2: Promise 방식   
    try {
        const videos = await Video.find({});
        console.log(videos);
        return res.render('home', {title: 'Home', videos});
    } catch {  // try 의 await(const Video)가 실패할 경우 catch문 실행
        return res.render('Server Error');
    }
};

export const watch = async (req, res) => { 
    const { id } = req.params;
    const video = await Video.findById(id);
    if(!video) {
        return res.render('404', { title: 'Video not found' });
    }
    return res.render('watch', { title: video.title, video });
};

export const getEdit = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if(!video) {
        return res.render('404', { title: 'Video not found' });
    }
    return res.render('editVideo', { title: `Edit: ${video.title}`, video });
};

export const postEdit = async (req, res) => {
    const { id } = req.params;
    const { title, description, hashtags } = req.body;
    const video = await Video.exists({ _id: id });

    if(!video) {
        return res.render('404', { title: 'Video not found' });
    }

    await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags: hashtags.split(',').map((item)=>(item.startsWith('#') ? `${item}` : `#${item}`))
    });

    return res.redirect(`/video/${id}`);
};

export const getUpload = (req, res) => {
    return res.render('uploadVideo', { title: `Upload Video` });
};

export const postUpload = async (req, res) => {
    const { title, description, hashtags } = req.body;
    
    try {
        await Video.create({
            title,
            description,
            hashtags: hashtags.split(',').map((item) => (item.startsWith('#') ? `${item}` : `#${item}`))
        });
        return res.redirect(`/`);
    } catch(error) {
        console.log(error);
        return res.render('uploadVideo', {title: 'Upload Video', errMessage: error._message});
    }
};
