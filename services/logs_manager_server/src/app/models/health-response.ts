// Define la estructura para el objeto 'data' dentro de cada check
interface CheckData {
    from: string;
    status: string;
}

// Define la estructura para cada 'check' en la lista
interface Check {
    data: CheckData;
    name: string;
    status: string;
}

// Define la estructura para el objeto principal que contiene los 'checks'
interface LiveStatus {
    status: string;
    checks: Check[];
    version: string;
    uptime: string;
}

interface HealthResposnse {
    checks: LiveStatus[];
}

export { LiveStatus, Check, CheckData }