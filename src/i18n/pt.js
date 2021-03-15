const pt = {
    translation: {
        self: {
            shortDesc: 'Uma ferramenta web de código aberto para mapeamento e análise automática da linha costeira usando imagens de satélite.',
            abstract: 'Uma ferramenta integrada à plataforma Google Earth Engine capaz de oferecer, de maneira acessível, acesso direto a dados públicos de satélites internacionais, contando com sofisticadas capacidades de análise de ocupação do solo tanto no domínio espacial quanto temporal. Produzida para atender às necessidades de cientistas, gestores e estudantes, com foco na conservação dos recursos naturais do planeta Terra.',
            poweredBy: 'Powered by: Google Earth Engine',
            imageryProvider: 'Fontes das imagens dos satélites: NASA (Landsat) e ESA (Sentinel)'
        },
        home: {
            about: {
                title: 'Conheça o CASSIE',
            },
            instructions: {
                title: 'Instruções para utilização do CASSIE',
                text: 'Para utilizar o CASSIE é necessário possuir uma conta google cadastrada na plataforma google earth engine.',
                btnEngineSingUp: 'Realizar Cadastro',
                btnManual: 'Manual de Uso',
                linkManual: 'https://tinyurl.com/cassie-manual-pt',
                btnVideo: 'Video Demonstrativo',
                linkVideo: 'https://www.youtube.com/watch?v=7q-3xNVq0tY&'
            },
            baysqueeze: {
                title: 'BAYSQUEEZE',
                text: 'O projeto procura contribuir com ações e resultados para o bem e preservação do nosso planeta, tomando para si, a tarefa de cumprir os objetivos de desenvolvimento sustentável, estabelecidos pela ONU, bem como atender às necessidades nacionais de conhecimento sobre mudanças climáticas, paralelamente aos objetivos da sub-rede "Zonas Costeiras", da Rede Brasileira de Pesquisas sobre Mudanças Climáticas Globais(Rede Clima).',
                btn: 'Mais sobre o projeto'
            },
            riscport: {
                title: 'RISCPORT',
                text: 'Este projeto tem como objetivo principal realizar uma análise dos riscos climáticos (ambientais e econômicos) e determinar as possíveis medidas de adaptação, como base na projeção futura das ameaças ambientais (ex: ondas de tempestades), para incrementar a resiliência do setor portuário e áreas adjacentes na Baía da Babitonga, em um contexto de uma rede interdisicplinar-multiinstitucuional.',
                btn: 'Mais sobre o projeto'
            },
            members: {
                title: 'Equipe',
                roles: {
                    researcher: 'Pesquisador',
                    coord: 'Coordenador',
                    atp: 'Bolsista ATP-B',
                    fumdes: 'Bolsista FUMDES'
                }
            },
            papers: {
                title: 'Produção científica',
                resumo_text: 'Resumo em Evento',
                curso_text: 'Curso',
                more: 'Saiba Mais'
            },
            sponsor: {
                realiza: 'Realização',
                apoio: 'Apoio Financeiro',
                apoio_desc: 'CNPq MCTIC/CNPq – N° 21/2017; Processo No. 441545/2017-3.',
                inst: 'Apoio Institucional',
                partners: 'Parceiros'
            },
            footer: {
                contact:{
                    title: 'Contato',
                    manage: 'Coordenação do projeto',
                    techquest: 'Dúvidas Técnicas'
                },
                resources: {
                    title: 'Recursos',
                    faq: 'Perguntas Frequentes',
                    code: 'Código Fonte'
                }
            }
        },        
        general: {
            loading: 'Carregando...',
            cancel: 'Cancelar'
        },
        auth: {
            signin: 'Acessar Ferramenta com o Google',
            signout: 'Sair',
            loading: 'Autenticando...'
        },
        forms: {
            acquisition: {
                title: 'Aquisição de Imagens',
                prev: 'Voltar',
                next: 'Continuar',
                '1': {
                    title: 'Escolha o satélite',
                    description: 'Selecione um dos satélites disponíveis para a aquisição de imagens.',
                    card: {
                        opticalResolution: 'Resolução ótica',
                        opticalResolutionUnit: 'metros',
                        activityPeriod: 'Período de atividade',
                        provider: 'Fornecedor',
                        revisitTime: 'Ciclo de captura',
                        revisitTimeUnit: 'dias',
                        choose: 'Escolher'
                    }
                },
                '2': {
                    title: 'Defina a área de interesse',
                    description: 'Delimite a área de interesse utilizando o mapa abaixo.',
                    showDelimiters: 'Mostrar delimitadores',
                    undo: 'Desfazer'
                },
                '3': {
                    title: 'Defina o período',
                    description: 'Especifique a data de início e data de término do conjunto de imagens.',
                    loading: 'Carregando...',
                    period: 'Período',
                    to: 'a',
                    durationDays: 'dias',
                    durationMonths: 'meses',
                    durationYears: 'anos',
                    imageQuantity: 'imagens',
                    cloudPercentage: 'Nível de nuvens'
                },
                '4': {
                    title: 'Filtre as imagens',
                    description: 'Aplique filtros para manter somente as imagens apropriadas.',
                    table: {
                        id: 'ID',
                        cloud: 'Nuvens',
                        thumbnail: 'Miniatura',
                        selected: 'Selecionada'
                    },
                    imagesPerPage: 'Imagens por página',
                    to: 'a',
                    of: 'de',
                    next: 'Concluir'
                }
            },
            map: {
                roi: 'Área de interesse',
                baseline: 'Linha de Base',
                shorelines: 'Linhas de Costa',
                transects: {
                    title: 'Transectos',
                    stable: 'Estável',
                    accreted: 'Acrescida',
                    eroded: 'Erodida',
                    criticallyEroded: 'Criticamente Erodida'
                },
                item: {
                    s: 'item',
                    p: 'itens'
                },
                cancel: 'Cancelar'
            },
            imageChooser: {
                title: 'Imagens disponíveis',
                resultQuantity: 'resultados',
                image: 'Imagem',
                load: 'Carregar',
                actions: {
                    title: 'Ações',
                    analyzeShoreline: {
                        title: 'Analisar linhas de costa',
                        imageSelection: {
                            title: 'Seleção de imagens',
                            cancel: 'Cancelar',
                            confirm: 'Confirmar'
                        },
                        baselineDraw: 'Desenhe a linha de base'
                    }
                }
            },
            shorelineParameters: {
                title: 'Parâmetros de análise',
                description: 'Defina os parâmetros de espaçamento e extensão dos transectos, em metros, e o coeficiente de limiarização (valores mais altos são mais rígidos quanto ao que é considerado um corpo de água).',
                spacing: 'Espaçamento (m)',
                extension: 'Extensão (m)',
                threshold: 'Limiar',
                cancel: 'Cancelar',
                confirm: 'Confirmar'
            },
            shorelineAnalysis: {
                title: 'Análise da Linha de Costa',
                transectsReport: {
                    title: 'Relatório de Transectos',
                    headers: {
                        id: 'ID',
                        initialLatitude: 'Latitude inicial',
                        initialLongitude: 'Longitude inicial',
                        finalLatitude: 'Latitude final',
                        finalLongitude: 'Longitude final',
                        initialDate: 'Data inicial',
                        finalDate: 'Data final',
                        intercept: 'Intercepto',
                        slope: 'Inclinação',
                        rsquared: 'r²',
                        lrr: 'LRR',
                        sce: 'SCE',
                        nsm: 'NSM',
                        epr: 'EPR',
                        label: 'Classe'
                    }
                },
                process: {
                    extraction: 'Extraindo linhas de costa',
                    estimate: 'Estimado'
                },
                exports: {
                    title: 'Exportar Dados de Transectos',
                    csv: 'Exportar CSV',
                    json: 'Exportar JSON',
                    shp: 'Exportar Shapefile'
                },
                close: 'Fechar'
            },
            transectEvolution: {
                statistics: 'Estatísticas',
                lrr: 'Taxa de alteração (LRR)',
                r: 'Coeficiente de correlação (r)',
                sce: 'SCE',
                nsm: 'NSM',
                epr: 'EPR',
                label: 'Classificação',
                units: {
                    meters: 'm',
                    mByYr: 'm/ano',
                    mByMonth: 'm/ano'
                },
                labels: {
                    x: 'Ano',
                    y: 'Distância da Linha de Base (m)',
                    trend: 'Tendência'
                }
            },
            imageryOverlay: {
                base: 'Base',
                hint: 'Nova camada',
                loading: 'Carregando',
                add: {
                    title: 'Nova camada',
                    name: 'Nome da camada',
                    expression: 'Expressão',
                    bands: {
                        title: 'Bandas disponíveis',
                        red: 'RED: Banda vermelha',
                        green: 'GREEN: Banda verde',
                        blue: 'BLUE: Banda azul',
                        nir: 'NIR: Banda infravermelho próximo',
                        swir: 'SWIR: Banda infravermelho de ondas curtas'
                    },
                    suggested: 'Expressões',
                    create: 'Criar'
                }
            }
        }
    }
}

export default pt