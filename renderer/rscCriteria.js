// Estrutura de critérios (RSC IFPR) em formato de dados para UI e PDF.
// Observação: valores e textos foram transcritos do formulário enviado pelo usuário.

window.RSC_CRITERIA = {
  title: 'CRITÉRIOS E PONTUAÇÕES DO RECONHECIMENTO DE SABERES E COMPETÊNCIAS - RSC',
  levels: [
    {
      key: 'RSC_I',
      label: 'RSC I',
      maxPoints: 140,
      items: [
        {
          key: '1',
          title:
            'Experiência na área de formação e/ou atuação do docente, contemplando o impacto de suas ações nas demais diretrizes dispostas para todos os níveis da RSC',
          maxPoints: 30,
          subitems: [
            { key: '1a', label: 'Gestão escolar', unit: 'ANUAL', pointsPerUnit: 2 },
            {
              key: '1b',
              label:
                'Exercício do magistério na educação básica, técnica, graduação ou pós-graduação',
              unit: 'ANUAL',
              pointsPerUnit: 2
            },
            { key: '1c', label: 'Gestão na área de atuação', unit: 'ANUAL', pointsPerUnit: 2 },
            {
              key: '1d',
              label: 'Experiência profissional na área de atuação',
              unit: 'ANUAL',
              pointsPerUnit: 2
            }
          ]
        },
        {
          key: '2',
          title: 'Cursos de capacitação na área de interesse institucional',
          maxPoints: 20,
          subitems: [
            { key: '2a', label: 'Participação em curso entre 20 e 59 horas', unit: 'CERTIFICADO', pointsPerUnit: 1 },
            { key: '2b', label: 'Participação em curso entre 60 e 119 horas', unit: 'CERTIFICADO', pointsPerUnit: 3 },
            { key: '2c', label: 'Participação em curso de 120 horas ou mais', unit: 'CERTIFICADO', pointsPerUnit: 5 },
            { key: '2d', label: 'Participação em evento de interesse institucional ou área de atuação', unit: 'CERTIFICADO', pointsPerUnit: 0.5 }
          ]
        },
        {
          key: '3',
          title: 'Atuação nos diversos níveis e modalidades da educação',
          maxPoints: 30,
          subitems: [
            { key: '3a', label: 'Curso de formação continuada', unit: 'UNIDADE', pointsPerUnit: 0.5 },
            { key: '3b', label: 'Curso de extensão', unit: 'UNIDADE', pointsPerUnit: 0.5 },
            { key: '3c', label: 'Proeja', unit: 'SEMESTRE', pointsPerUnit: 1.5 },
            { key: '3d', label: 'Técnico', unit: 'SEMESTRE', pointsPerUnit: 1.5 },
            { key: '3e', label: 'Superior', unit: 'SEMESTRE', pointsPerUnit: 1.5 },
            { key: '3f', label: 'Pós-graduação lato sensu', unit: 'DISCIPLINA/SEMESTRE', pointsPerUnit: 2 },
            { key: '3g', label: 'Pós-graduação Stricto Sensu (Mestrado)', unit: 'DISCIPLINA/SEMESTRE', pointsPerUnit: 2.5 },
            { key: '3h', label: 'Pós-graduação Stricto Sensu (Doutorado)', unit: 'DISCIPLINA/SEMESTRE', pointsPerUnit: 3 },
            {
              key: '3i',
              label: 'Curso de curta duração ministrado em âmbito municipal, regional ou estadual',
              unit: 'UNIDADE',
              pointsPerUnit: 0.5
            },
            {
              key: '3j',
              label: 'Palestra ministrada em âmbito municipal, regional ou estadual',
              unit: 'UNIDADE',
              pointsPerUnit: 0.2
            }
          ]
        },
        {
          key: '4',
          title:
            'Implantação de ambientes de aprendizagem, nas atividades de ensino, pesquisa, extensão e/ou inovação',
          maxPoints: 30,
          subitems: [
            { key: '4a', label: 'Co-autoria de unidade ou capítulo de livro didático ou instrucional', unit: 'UNIDADE/CAPÍTULO', pointsPerUnit: 2 },
            { key: '4b', label: 'Autoria de livro didático ou instrucional', unit: 'LIVRO', pointsPerUnit: 4 },
            { key: '4c', label: 'Desenvolvimento, atuação e/ou implantação de ambientes de aprendizagem', unit: 'AMBIENTE', pointsPerUnit: 2 },
            { key: '4d', label: 'Produção de objetos de aprendizagem', unit: 'OBJETO', pointsPerUnit: 1 },
            { key: '4e', label: 'Revisor Editorial de Livro Didático ou Instrucional', unit: 'LIVRO', pointsPerUnit: 2 },
            { key: '4f', label: 'Diagramação de Livro Didático ou Instrucional', unit: 'LIVRO', pointsPerUnit: 2 },
            { key: '4g', label: 'Participação como tutor presencial', unit: 'SEMESTRE', pointsPerUnit: 1 },
            { key: '4h', label: 'Participação como tutor on-line', unit: 'SEMESTRE', pointsPerUnit: 1 },
            { key: '4i', label: 'Participação em atividades junto ao MEC (cessão)', unit: 'SEMESTRE', pointsPerUnit: 1 }
          ]
        },
        {
          key: '5',
          title:
            'Atuação na gestão acadêmica e institucional, contemplando o impacto de suas ações nas demais diretrizes dispostas para todos os níveis da RSC',
          maxPoints: 10,
          subitems: [
            { key: '5a', label: 'Função de reitor', unit: 'ANUAL', pointsPerUnit: 2.5 },
            { key: '5b', label: 'Função de pró-reitor ou chefe de gabinete', unit: 'ANUAL', pointsPerUnit: 2 },
            { key: '5c', label: 'Função de direção geral de câmpus', unit: 'ANUAL', pointsPerUnit: 1.5 },
            { key: '5d', label: 'Outros cargos de direção', unit: 'ANUAL', pointsPerUnit: 1 },
            { key: '5e', label: 'Função de chefia de setor', unit: 'ANUAL', pointsPerUnit: 1 },
            { key: '5f', label: 'Outras funções de gestão', unit: 'ANUAL', pointsPerUnit: 1 }
          ]
        },
        {
          key: '6',
          title:
            'Participação em processos seletivos, em bancas de avaliação acadêmica e/ou de concursos',
          maxPoints: 10,
          subitems: [
            { key: '6a', label: 'Banca de processo seletivo', unit: 'BANCA', pointsPerUnit: 0.3 },
            { key: '6b', label: 'Banca de concurso público', unit: 'BANCA', pointsPerUnit: 0.5 },
            { key: '6c', label: 'Elaboração ou revisão de provas de concurso público', unit: 'DISCIPLINA', pointsPerUnit: 1 },
            { key: '6d', label: 'Banca de trabalhos de conclusão de curso de técnico, graduação', unit: 'BANCA', pointsPerUnit: 0.3 },
            { key: '6e', label: 'Outras bancas', unit: 'ITEM', pointsPerUnit: 0.2 }
          ]
        },
        {
          key: '7',
          title:
            'Outras graduações, na área de interesse, além daquela que o habilita e define o nível de RSC pretendido, no âmbito do plano de qualificação profissional',
          maxPoints: 10,
          subitems: [{ key: '7a', label: '2ª Graduação', unit: 'CERTIFICADO', pointsPerUnit: 10 }]
        }
      ]
    },
    {
      key: 'RSC_II',
      label: 'RSC II',
      maxPoints: 140,
      items: [
        {
          key: '8',
          title:
            'Orientação ao corpo discente em atividades de ensino, extensão, pesquisa e/ou inovação',
          maxPoints: 30,
          subitems: [
            { key: '8a', label: 'Orientação de educandos em atividades de ensino, pesquisa, extensão e/ou inovação', unit: 'ATIVIDADE', pointsPerUnit: 0.5 },
            { key: '8b', label: 'Orientação de educandos em trabalhos de conclusão de curso técnico ou de graduação', unit: 'ATIVIDADE', pointsPerUnit: 0.5 },
            { key: '8c', label: 'Orientação de trabalhos de conclusão da especialização lato sensu', unit: 'MONOGRAFIA', pointsPerUnit: 0.5 }
          ]
        },
        {
          key: '9',
          title:
            'Participação no desenvolvimento de protótipos, depósitos e/ou registros de propriedade intelectual',
          maxPoints: 10,
          subitems: [
            { key: '9a', label: 'Desenvolvimento de protótipos', unit: 'UNIDADE', pointsPerUnit: 2.5 },
            { key: '9b', label: 'Depósitos efetuados', unit: 'UNIDADE', pointsPerUnit: 5 },
            { key: '9c', label: 'Registro de propriedade intelectual', unit: 'REGISTRO', pointsPerUnit: 10 }
          ]
        },
        {
          key: '10',
          title: 'Participação em grupos de trabalho e/ou oficinas institucionais',
          maxPoints: 20,
          subitems: [
            { key: '10a', label: 'Participação em oficinas institucionais', unit: 'ATIVIDADE', pointsPerUnit: 1 },
            { key: '10b', label: 'Participação em grupos de trabalho', unit: 'ATIVIDADE', pointsPerUnit: 1 }
          ]
        },
        {
          key: '11',
          title:
            'Participação no desenvolvimento de projetos, de interesse institucional, de ensino, pesquisa, extensão e/ou inovação',
          maxPoints: 30,
          subitems: [
            { key: '11a', label: 'Participação como coordenador em projeto de interesse institucional (ensino/pesquisa/extensão/inovação)', unit: 'SEMESTRE', pointsPerUnit: 2 },
            { key: '11b', label: 'Participação como colaborador em projeto de interesse institucional (ensino/pesquisa/extensão/inovação)', unit: 'SEMESTRE', pointsPerUnit: 1 }
          ]
        },
        {
          key: '12',
          title:
            'Participação no desenvolvimento de projetos e/ou práticas pedagógicas de reconhecida relevância',
          maxPoints: 20,
          subitems: [
            { key: '12a', label: 'Participação como coordenador de projeto em parceria com outras instituições, comunidade interna e/ou externa', unit: 'SEMESTRE', pointsPerUnit: 2 },
            { key: '12b', label: 'Participação como colaborador de projeto em parceria com outras instituições, comunidade interna e/ou externa', unit: 'SEMESTRE', pointsPerUnit: 1 }
          ]
        },
        {
          key: '13',
          title:
            'Participação na organização de eventos científicos, tecnológicos, esportivos, sociais e/ou culturais',
          maxPoints: 20,
          subitems: [
            { key: '13a', label: 'Participação como coordenador de evento', unit: 'EVENTO', pointsPerUnit: 1 },
            { key: '13b', label: 'Participação na organização de evento', unit: 'EVENTO', pointsPerUnit: 0.5 }
          ]
        },
        {
          key: '14',
          title:
            'Outras pós-graduações lato sensu, na área de interesse, além daquela que o habilita e define o nível de RSC pretendido, no âmbito do plano de qualificação institucional',
          maxPoints: 10,
          subitems: [{ key: '14a', label: '2ª Especialização', unit: 'CERTIFICADO', pointsPerUnit: 10 }]
        }
      ]
    },
    {
      key: 'RSC_III',
      label: 'RSC III',
      maxPoints: 140,
      items: [
        {
          key: '15',
          title: 'Desenvolvimento, produção e transferência de tecnologias',
          maxPoints: 10,
          subitems: [
            { key: '15a', label: 'Desenvolvimento e/ou produção de tecnologia', unit: 'ITEM', pointsPerUnit: 5 },
            { key: '15b', label: 'Transferência de tecnologia', unit: 'ITEM', pointsPerUnit: 5 }
          ]
        },
        {
          key: '16',
          title:
            'Desenvolvimento de pesquisas e aplicação de métodos e tecnologias educacionais que proporcionem a interdisciplinariedade e a integração de conteúdos acadêmicos',
          maxPoints: 30,
          subitems: [
            { key: '16a', label: 'Desenvolvimento de pesquisa e aplicação de métodos e tecnologias educacionais', unit: 'SEMESTRE', pointsPerUnit: 1 },
            { key: '16b', label: 'Desenvolvimento de atividades educacionais de integração dos conteúdos acadêmicos', unit: 'SEMESTRE', pointsPerUnit: 1 },
            { key: '16c', label: 'Resumo publicado em anais de evento internacional', unit: 'UNIDADE', pointsPerUnit: 0.5 },
            { key: '16d', label: 'Artigo publicado em periódico ou anais de eventos com qualis ou com ISSN', unit: 'ARTIGO', pointsPerUnit: 1.5 },
            { key: '16e', label: 'Livro publicado', unit: 'UNIDADE', pointsPerUnit: 6 },
            { key: '16f', label: 'Bancas de trabalho de conclusão de especialização lato sensu e stricto sensu', unit: 'BANCA', pointsPerUnit: 1 },
            { key: '16g', label: 'Orientação de trabalhos em cursos stricto sensu', unit: 'DISSERTAÇÃO', pointsPerUnit: 1 },
            { key: '16h', label: 'Membro de comissão editorial', unit: 'SEMESTRE', pointsPerUnit: 0.5 },
            { key: '16i', label: 'Consultor/revisor/avaliador (revistas, periódicos, projetos, eventos)', unit: 'ITEM/SEMESTRE', pointsPerUnit: 0.5 }
          ]
        },
        {
          key: '17',
          title:
            'Desenvolvimento de pesquisas e atividades de extensão que proporcionem a articulação institucional com os arranjos sociais, culturais e produtivos',
          maxPoints: 30,
          subitems: [
            { key: '17a', label: 'Coordenação de pesquisas (arranjos sociais/culturais/produtivos) no âmbito da instituição', unit: 'SEMESTRE', pointsPerUnit: 2 },
            { key: '17b', label: 'Colaboração em pesquisas (arranjos sociais/culturais/produtivos) no âmbito da instituição', unit: 'SEMESTRE', pointsPerUnit: 1 },
            { key: '17c', label: 'Coordenação de atividades de extensão (arranjos sociais/culturais/produtivos) no âmbito da instituição', unit: 'SEMESTRE', pointsPerUnit: 2 },
            { key: '17d', label: 'Colaboração em atividades de extensão (arranjos sociais/culturais/produtivos) no âmbito da instituição', unit: 'SEMESTRE', pointsPerUnit: 1 },
            { key: '17e', label: 'Organização de atividades de pesquisa e/ou extensão (arranjos sociais/culturais/produtivos) no âmbito da instituição', unit: 'ATIVIDADE', pointsPerUnit: 1 },
            { key: '17f', label: 'Coordenação de grupo de estudo registrado na direção de ensino, pesquisa e extensão', unit: 'SEMESTRE', pointsPerUnit: 1 },
            { key: '17g', label: 'Participação em grupo de estudo registrado na direção de ensino, pesquisa e extensão', unit: 'SEMESTRE', pointsPerUnit: 0.5 }
          ]
        },
        {
          key: '18',
          title: 'Atuação em projetos e/ou atividades em parceria com outras instituições',
          maxPoints: 20,
          subitems: [
            { key: '18a', label: 'Participação em grupo de pesquisa registrado no CNPQ no âmbito da instituição', unit: 'SEMESTRE', pointsPerUnit: 1 },
            { key: '18b', label: 'Participação em grupo de pesquisa registrado no CNPQ em outra instituição', unit: 'SEMESTRE', pointsPerUnit: 1 },
            { key: '18c', label: 'Coordenação de pesquisa com parceria(s) externa(s) (arranjos sociais/culturais/produtivos)', unit: 'SEMESTRE', pointsPerUnit: 2 },
            { key: '18d', label: 'Colaboração em pesquisa com parceria(s) externa(s) (arranjos sociais/culturais/produtivos)', unit: 'SEMESTRE', pointsPerUnit: 1 },
            { key: '18e', label: 'Orientação de educandos em trabalhos de conclusão em curso stricto sensu', unit: 'DISSERTAÇÃO', pointsPerUnit: 1 }
          ]
        },
        {
          key: '19',
          title: 'Atuação em atividades de assistência técnica nacional e/ou internacional',
          maxPoints: 10,
          subitems: [
            { key: '19a', label: 'Atividade de assistência técnica nacional', unit: 'SEMESTRE', pointsPerUnit: 1 },
            { key: '19b', label: 'Atividade de assistência técnica internacional', unit: 'SEMESTRE', pointsPerUnit: 1 },
            { key: '19c', label: 'Curso ministrado em âmbito nacional ou internacional', unit: 'CURSO', pointsPerUnit: 2 },
            { key: '19d', label: 'Palestra ministrada em âmbito nacional ou internacional', unit: 'PALESTRA', pointsPerUnit: 1 },
            { key: '19e', label: 'Participação como avaliador requisitado ou convidado por órgãos governamentais ou particulares', unit: 'ATIVIDADE', pointsPerUnit: 2 }
          ]
        },
        {
          key: '20',
          title:
            'Produção acadêmica e/ou tecnológica, nas atividades de ensino, pesquisa, extensão e/ou inovação',
          maxPoints: 30,
          subitems: [
            { key: '20a', label: 'Resumo publicado em anais de eventos regional ou nacional', unit: 'RESUMO', pointsPerUnit: 0.3 },
            { key: '20b', label: 'Publicação de artigo em periódico sem qualis', unit: 'ARTIGO', pointsPerUnit: 0.5 },
            { key: '20c', label: 'Artigos publicados em jornais, revistas e outros meios de comunicação', unit: 'UNIDADE', pointsPerUnit: 0.3 },
            { key: '20d', label: 'Co-autoria de livro publicado', unit: 'UNIDADE', pointsPerUnit: 4 },
            { key: '20e', label: 'Organizador de livro publicado', unit: 'UNIDADE', pointsPerUnit: 3 },
            { key: '20f', label: 'Capítulo de livro publicado', unit: 'UNIDADE', pointsPerUnit: 3 },
            { key: '20g', label: 'Produção de programa de rádio ou TV', unit: 'PROGRAMA', pointsPerUnit: 0.5 },
            { key: '20h', label: 'Partitura musical', unit: 'PARTITURA', pointsPerUnit: 3 },
            { key: '20i', label: 'Prefácio e posfácio de livro', unit: 'PREFÁCIO/POSFÁCIO', pointsPerUnit: 1 },
            { key: '20j', label: 'Produção artística e/ou cultural', unit: 'UNIDADE', pointsPerUnit: 0.5 },
            { key: '20k', label: 'Autoria de livro didático ou instrucional', unit: 'UNIDADE', pointsPerUnit: 6 },
            { key: '20l', label: 'Organizador de livro didático ou instrucional', unit: 'LIVRO', pointsPerUnit: 3 },
            { key: '20m', label: 'Prêmios por atividades científicas, artísticas, esportivas e culturais', unit: 'PRÊMIO', pointsPerUnit: 3 },
            { key: '20n', label: 'Outra produção acadêmica e/ou tecnológica', unit: 'PRODUÇÃO', pointsPerUnit: 0.5 }
          ]
        },
        {
          key: '22',
          title:
            'Outras pós-graduações strictu sensu, na área de interesse, além daquela que o habilita e define o nível de RSC pretendido, no âmbito do plano de qualificação institucional',
          maxPoints: 10,
          subitems: [{ key: '22a', label: '2º Mestrado', unit: 'DIPLOMA', pointsPerUnit: 10 }]
        }
      ]
    }
  ]
};

