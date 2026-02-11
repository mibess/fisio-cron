export interface CronogramaItem {
    hora?: string;
    descricao: string;
}

export interface CronogramaDia {
    nome: string;
    itens: CronogramaItem[];
}

export interface CronogramaFase {
    titulo: string;
    dias: CronogramaDia[];
}

export interface Cronograma {
    faseAtual: string;
    inicio?: string;
    duracaoSemanas?: number;
    objetivo?: string;
    regras?: string[];
    fases: CronogramaFase[];
}
