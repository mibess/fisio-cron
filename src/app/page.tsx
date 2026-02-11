'use client';

import { useEffect, useState } from 'react';
import { Cronograma, CronogramaFase } from '@/types/cronograma';
import Link from 'next/link';

export default function Home() {
    const [cronograma, setCronograma] = useState<Cronograma | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDay, setSelectedDay] = useState<string>('');

    useEffect(() => {
        fetch('/api/cronograma')
            .then(async (res) => {
                if (!res.ok) {
                    if (res.status === 404) return null;
                    throw new Error('Falha ao carregar cronograma');
                }
                return res.json();
            })
            .then((data) => {
                if (data) {
                    setCronograma(data);
                    // Auto-select first day of current phase
                    const currentPhase = data.fases.find((f: CronogramaFase) => f.titulo === data.faseAtual);
                    if (currentPhase && currentPhase.dias.length > 0) {
                        setSelectedDay(currentPhase.dias[0].nome);
                    }
                }
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 text-red-600">
                <h1 className="text-2xl font-bold mb-4">Erro</h1>
                <p className="mb-6">{error}</p>
                <Link href="/upload" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                    Tentar Novamente
                </Link>
            </div>
        );
    }

    if (!cronograma) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
                <h1 className="text-2xl font-bold mb-4 text-gray-800">Bem-vindo ao Cronograma App</h1>
                <p className="mb-6 text-gray-600">Nenhum cronograma encontrado.</p>
                <Link href="/upload" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                    Fazer Upload do Arquivo
                </Link>
            </div>
        );
    }

    const currentPhase = cronograma.fases.find((f) => f.titulo === cronograma.faseAtual);

    // Validation errors based on spec
    if (!currentPhase) return <div className="p-8 text-red-500">Erro: Fase atual &quot;{cronograma.faseAtual}&quot; não encontrada nas fases.</div>;
    if (!currentPhase.dias || currentPhase.dias.length === 0) return <div className="p-8 text-red-500">Erro: Nenhum dia encontrado nesta fase.</div>;

    const selectedDayData = currentPhase.dias.find((d) => d.nome === selectedDay);

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-900">Cronograma</h1>
                    <Link href="/upload" className="text-sm text-blue-600 hover:text-blue-800">
                        Novo Upload
                    </Link>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">

                {/* Phase Card */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-blue-500">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Fase Atual</h2>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{currentPhase.titulo}</p>
                    {cronograma.objetivo && (
                        <p className="text-gray-600 mt-2 text-sm italic">Objetivo: {cronograma.objetivo}</p>
                    )}
                </div>

                {/* Day Selector */}
                <div className="mb-8">
                    <label htmlFor="day-select" className="block text-sm font-medium text-gray-700 mb-2">
                        Selecione o Dia:
                    </label>
                    <select
                        id="day-select"
                        value={selectedDay}
                        onChange={(e) => setSelectedDay(e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm bg-white"
                    >
                        {currentPhase.dias.map((dia) => (
                            <option key={dia.nome} value={dia.nome}>
                                {dia.nome}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Schedule View */}
                {selectedDayData && (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Cronograma de {selectedDayData.nome}</h3>
                        </div>
                        <ul className="divide-y divide-gray-200">
                            {selectedDayData.itens.map((item, idx) => (
                                <li key={idx} className="px-6 py-4 flex items-start hover:bg-gray-50 transition duration-150 ease-in-out">
                                    <div className="flex-shrink-0 w-20">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.hora ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {item.hora || 'Sem horário'}
                                        </span>
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <p className="text-sm text-gray-900">{item.descricao}</p>
                                    </div>
                                </li>
                            ))}
                            {selectedDayData.itens.length === 0 && (
                                <li className="px-6 py-4 text-center text-gray-500 italic">Nenhum item para este dia.</li>
                            )}
                        </ul>
                    </div>
                )}
            </main>
        </div>
    );
}
