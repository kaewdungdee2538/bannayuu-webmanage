import axios from "axios";
import ApiRoute from "../apiroute";

export default function getImageFormUrl(image_path){
    const config = {
        headers: {  },
      };

      const url =`${ApiRoute.image_line_url}${image_path}`
      return axios.post(url)
        .then((res) => {
          return res.data.response;
        }).catch(err=>{
            console.log(err)
        });
}