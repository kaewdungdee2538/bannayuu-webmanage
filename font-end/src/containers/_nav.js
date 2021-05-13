import { nav_estamp_head, nav_estamp_item } from './nav/nav_estamp'
import { nav_parcel_head, nav_parcel_item } from './nav/nav_parcel'
import { nav_home_head, nav_home_item, nav_villager_item } from './nav/nav_home'
import { nav_payment_head, nav_payment_corporate_item, nav_payment_villager_item } from './nav/nav_payment'
import { nav_complaint_head, nav_complaint_item } from './nav/nav_complaint'
import { nav_announce_head, nav_announce_item } from './nav/nav_announce'
import { nav_sos_head, nav_sos_item } from './nav/nav_sos'
import { nav_parking_head, nav_parking_item } from './nav/nav_parking'
import { nav_cartype_head, nav_cartype_item} from './nav/nav_cartype'
import { nav_card_head, nav_card_item} from './nav/nav_card'

function GetNavBarItems(privilege_info) {
    const _nav = []
    if (!privilege_info)
        return [];
    if (privilege_info.estamp.status) {
        _nav.push(nav_estamp_head)
        _nav.push(nav_estamp_item)
    }
    if (privilege_info.parcel.status) {
        _nav.push(nav_parcel_head)
        _nav.push(nav_parcel_item)
    }
    if(privilege_info.cartype.status){
        _nav.push(nav_cartype_head)
        _nav.push(nav_cartype_item)
    }
    if (privilege_info.home.status) {
        _nav.push(nav_home_head)
        _nav.push(nav_home_item)
        _nav.push(nav_villager_item)
    }
    if (privilege_info.payment.status) {
        _nav.push(nav_payment_head)
        _nav.push(nav_payment_corporate_item)
        _nav.push(nav_payment_villager_item)
    }
    if (privilege_info.sos.status) {
        _nav.push(nav_sos_head)
        _nav.push(nav_sos_item)
    }
    if (privilege_info.parking.status) {
        _nav.push(nav_parking_head)
        _nav.push(nav_parking_item)
    }
    if (privilege_info.complaint.status) {
        _nav.push(nav_complaint_head)
        _nav.push(nav_complaint_item)
    }
    if (privilege_info.annoince.status) {
        _nav.push(nav_announce_head)
        _nav.push(nav_announce_item)
    }
    if(privilege_info.card.status){
        _nav.push(nav_card_head)
        _nav.push(nav_card_item)
    }
    return _nav;
}




export default GetNavBarItems;
