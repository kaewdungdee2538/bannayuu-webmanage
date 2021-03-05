import * as config from './config.json'
const ApiRoute ={
    main_url:config.config.url_hosting,
    port:config.config.url_port,
    login:{
        login_url:'/webbannayuu/api/auth/login'
    },home:{
        get_allhome_url:'/webbannayuu/api/home/get-all'
        ,add_homeinfo_url:'/webbannayuu/api/home/add-home'
        ,get_home_byid_url:'/webbannayuu/api/home/get-home-by-id'
        ,edit_homeinfo_url:'/webbannayuu/api/home/edit-home'
        ,delete_homeinfo_url:'/webbannayuu/api/home/delete-home'
    },villager:{
        get_home_for_villager_url:'/webbannayuu/api/villager/get-allhome'
        ,get_allvillager_byhomeid_url:'/webbannayuu/api/villager/get-all-by-homeid'
        ,add_villager_url:'/webbannayuu/api/villager/add-villager'
        ,get_vilager_byhomelineid_url:'/webbannayuu/api/villager/get-by-homelineid'
        ,edit_villager_url:'/webbannayuu/api/villager/edit-villager'
        ,delete_villager_url:'/webbannayuu/api/villager/delete-villager'
    },announce:{
        get_announce_all_url:'/webbannayuu/api/announce/get-all'
        ,get_announce_byid_url:'/webbannayuu/api/announce/get-by-id'
        ,add_announce_url:'/webbannayuu/api/announce/add-announce'
        ,edit_announce_url:'/webbannayuu/api/announce/edit-announce'
        ,delete_announce_url:'/webbannayuu/api/announce/cancel-announce'
        ,get_history_announce_all_url:'/webbannayuu/api/announce-history/get-normal'
        ,get_history_announce_by_hni_id_url:'/webbannayuu/api/announce-history/get-by-id'
    },estamp:{
        get_estamp_visitor_all:'/webbannayuu/api/estamp-all/getvisitorall'
        ,get_visitor_record_byid:'/webbannayuu/api/estamp-all/get-visitor-byid'
        ,edit_visitor_estamp_url:'/webbannayuu/api/estamp-all/edit-estamp'
    }
}
export default ApiRoute;