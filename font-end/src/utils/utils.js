const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
const formatuuid = /[ `!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?~]/;
const formathome = /[`@#$%^&*;'|<>~]/;
const formatname = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

export function IsNumber(input) {

    try {
        const value = parseInt(input);
        if (typeof value !== 'number') {
            return false
        }
        if (value !== Number(value)) {
            return false
        }
        if (value === Infinity) {
            return false
        }
        return true
    } catch { return false }
}

export function HaveSpecialFormat(input) {
    if (format.test(input))
        return true;
    return false;
}

export function HaveSpecialUuidFormat(input) {
    if (formatuuid.test(input))
        return true;
    return false;
}

export function HaveSpecialHomeFormat(input) {
    if (formathome.test(input))
        return true;
    return false;
}

export function HaveSpecialNameFormat(input) {
    if (formatname.test(input))
        return true;
    return false;
}
