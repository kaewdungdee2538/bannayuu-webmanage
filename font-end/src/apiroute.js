const ApiRoute ={
    main_url:'http://localhost:',
    port:'4010',
    login:{
        login_url:'/webbannayuu/api/auth/login'
    },home:{
        get_allhome_url:'/webbannayuu/api/home/get-all'
        ,add_homeinfo_url:'/webbannayuu/api/home/add-home'
        ,get_home_byid_url:'/webbannayuu/api/home/get-home-by-id'
        ,edit_homeinfo_url:'/webbannayuu/api/home/edit-home'
        ,delete_homeinfo_url:'/webbannayuu/api/home/delete-home'
    },villager:{
        get_allvillager_byhomeid_url:'/webbannayuu/api/villager/get-all-by-homeid'
        ,add_villager_url:'/webbannayuu/api/villager/add-villager'
        ,get_vilager_byhomelineid_url:'/webbannayuu/api/villager/get-by-homelineid'
        ,edit_villager_url:'/webbannayuu/api/villager/edit-villager'
    }
}
export default ApiRoute;