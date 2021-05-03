import * as config from './config.json'
const ApiRoute ={
    main_url:config.config.url_hosting,
    socket_url:config.config.url_socket_hosting,
    image_line_url:config.config.url_image_line,
    image_payment_url:config.config.url_image_payment,
    image_web_url:config.config.url_web_image,
    port:config.config.url_port,
    login:{
        login_url:'/webbannayuu/api/auth/login'
    },home:{
        get_allhome_url:'/webbannayuu/api/home/get-all'
        ,get_allhome_not_disable_url:'/webbannayuu/api/home/get-all-not-disable'
        ,get_alladdress_not_disable_url:'/webbannayuu/api/home/get-address-not-disable'
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
        ,save_change_home_villager_url:'/webbannayuu/api/villager/home-change'
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
        ,get_estamp_visitor_not_estamp_url:'/webbannayuu/api/estamp-change-home/get-not-estamp'
        ,save_change_home_visitor_url:'/webbannayuu/api/estamp-change-home/change-home'
        ,get_visitor_estamp_history_all_url:'/webbannayuu/api/estamp-all/getvisitor-estamp-history'
    },complaint:{
        get_complaint_by_id_url:'/webbannayuu/api/complaint/get-byid'
        ,get_complaint_not_approve_url:'/webbannayuu/api/complaint/complaint-notapprove'
        ,get_complaint_reciept_url:'/webbannayuu/api/complaint/complaint-receipt'
        ,get_complaint_success_url:'/webbannayuu/api/complaint/complaint-success'
        ,save_complaint_to_receipt_url:'/webbannayuu/api/complaint/save-to-receipt'
        ,save_complaint_to_reject_url:'/webbannayuu/api/complaint/save-to-reject'
        ,save_complaint_to_success_url:'/webbannayuu/api/complaint/save-to-success'
        ,save_complaint_to_cancel_url:'/webbannayuu/api/complaint/save-to-cancel'
    },parcel:{
        get_parcel_wait_send_url :'/webbannayuu/api/parcel/get/wait-send'
        ,get_parcel_wait_send_by_id_url:'/webbannayuu/api/parcel/get/wait-send-byid'
        ,get_parcel_sended_url:'/webbannayuu/api/parcel/get/sended'
        ,save_parcel_receive_url :'/webbannayuu/api/parcel/receive-parcel'
        ,save_parcel_reject_url :'/webbannayuu/api/parcel/reject-parcel'
        ,save_parcel_send_url :'/webbannayuu/api/parcel/send-parcel'
        ,get_parcel_history_url :'/webbannayuu/api/parcel/get/history'
        ,get_parcel_history_by_id_url:'/webbannayuu/api/parcel/get/history-by-id'
        ,save_change_home_parcel_url:'/webbannayuu/api/parcel/change-home'
        ,save_cancel_send_parcel_url:'/webbannayuu/api/parcel/cancel-send'
    },user_profile:{
        get_user_profile_by_id_url : '/webbannayuu/api/user-profile/get-by-id'
    },notification_item:{
        get_notification_item_all_url:'/webbannayuu/api/notification-item/get-all'
    },sos:{
        get_sos_info_all_url:'/webbannayuu/api/sos/get-all'
        ,get_sos_info_by_id_url:'/webbannayuu/api/sos/get-by-id'
        ,get_sos_info_all_history_url:'/webbannayuu/api/sos/get-all-history'
        ,save_sos_corporate_receive_url:'/webbannayuu/api/sos/corporate-receive'
        ,save_sos_corporate_reject_url:'/webbannayuu/api/sos/corporate-reject'
    },villager_cost:{
        get_villager_cost_not_pay_url:'/webbannayuu/api/villager-cost/get-villager-cost-nopay'
        ,get_villager_cost_get_by_id_url:'/webbannayuu/api/villager-cost/get-villager-cost-byid'
        ,get_villager_cost_get_by_id_history_url:'/webbannayuu/api/villager-cost/get-villager-cost-byid-history'
        ,get_villager_cost_history_url:'/webbannayuu/api/villager-cost/get-villager-cost-history'
        ,add_villager_cost_url:'/webbannayuu/api/villager-cost/add-villager-cost'
        ,edit_villager_cost_url:'/webbannayuu/api/villager-cost/edit-villager-cost'
        ,cancel_villager_cost_url:'/webbannayuu/api/villager-cost/cancel-villager-cost'
    },payment_event:{
        get_payment_event_all_url:'/webbannayuu/api/payment-event/getall'
        ,get_payment_workflow_all_url:'/webbannayuu/api/workflow/getpayment'
    },villager_payment:{
        get_villager_payment_all_url:'/webbannayuu/api/payment-management/get-management'
        ,get_villager_payment_by_id_url:'/webbannayuu/api/payment-management/get-management-by-id'
        ,get_villager_payment_history_all_url:'/webbannayuu/api/payment-history/get-history'
        ,get_villager_payment_history_by_id_url:'/webbannayuu/api/payment-history/get-history-by-id'
        ,save_villager_payment_approve_url:'/webbannayuu/api/payment-management/approve-payment'
        ,save_villager_payment_cancel_url:'/webbannayuu/api/payment-management/reject-payment'
        
    },license:{
        get_license_by_home_id_url:'/webbannayuu/api/car/get-byhome'
        ,get_license_by_home_car_id_url:'/webbannayuu/api/car/get-bycarid'
        ,add_license_by_home_id_url:'/webbannayuu/api/car/add-byhome'
        ,save_edit_license_url:'/webbannayuu/api/car/edit-info'
        ,save_edit_license_home_change_url:'/webbannayuu/api/car/edit-home-change'
    },cartype:{
        get_cartype_all_url:'/webbannayuu/api/car-type/get-all'
    },parking:{
        get_parking_master_all_url:'/webbannayuu/api/parking-config-master/get-all'
        ,get_parking_master_id_url:'/webbannayuu/api/parking-config-master/get-by-id'
    }
}
export default ApiRoute;