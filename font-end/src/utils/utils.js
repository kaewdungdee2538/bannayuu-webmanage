const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
const formatuuid = /[ `!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?~]/;
const formathome = /[`@#$%^&*;'|<>~]/;
const formatname = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
const formatEng = /[^a-zA-Z0-9]/;

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


export function isNotEngCharOrNumber(input) {
    if (formatEng.test(input))
        return true;
    return false;
}

export  function checkFileNotOver10Mb(imageInput) {
    const fsize = imageInput.size;
    const file = Math.round((fsize / 1024));
    const sizeMb = (file / 1024);
    if (sizeMb > 10) {
        return false;
    }
    return true;
}
