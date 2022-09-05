export const filterDep = (address, dep) => {

    if (dep === 51) {
        if (address.toLowerCase().indexOf('элист') !== -1
            || address.toLowerCase().indexOf('яшкул') !== -1
            || address.toLowerCase().indexOf('троицк') !== -1
            || address.toLowerCase().indexOf('дербет') !== -1
            || address.toLowerCase().indexOf('царын') !== -1
            || address.toLowerCase().indexOf('аршан') !== -1
            || address.toLowerCase().indexOf('кетчене') !== -1
            || address.toLowerCase().indexOf('городовико') !== -1
            || address.toLowerCase().indexOf('светлогр') !== -1
            || address.toLowerCase().indexOf('садовое') !== -1
            || address.toLowerCase().indexOf('приютное') !== -1
            || address.toLowerCase().indexOf('аман') !== -1
            || address.toLowerCase().indexOf('лагань') !== -1
        ) {
            return true
        }
    } else {
        return true
    }
}