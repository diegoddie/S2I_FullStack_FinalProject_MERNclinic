import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import it from 'date-fns/locale/it/index.js';

const formatDate = (dateString, typology) => {
    const timeZone = 'Europe/Rome'
    const date = new Date(dateString);
    const zonedDate = utcToZonedTime(date, timeZone);

    if (typology === 'vacation') {
        return format(zonedDate, 'dd/MM/yyyy', { locale: it, timeZone });
    } else {
        const formattedDate = format(zonedDate, 'dd/MM/yyyy', { locale: it, timeZone });
        const formattedTime = format(zonedDate, 'HH:mm', { locale: it, timeZone });

        return `${formattedDate} ${formattedTime}`;
    }
};

export default formatDate;
