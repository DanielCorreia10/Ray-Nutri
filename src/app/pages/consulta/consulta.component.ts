import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Paciente {
  id_paciente?: number;
  nome: string;
  sobrenome: string;
  celular: string;
  data_nascimento: string;
  sexo: 'masculino' | 'feminino';
  email: string;
}

interface Consulta {
  id_ficha?: number;
  data_consulta: string;
  horario_consulta: string;
  tipo: 'primeira' | 'retorno' | 'avaliacao';
  objetivo: string;
  altura: number;
  peso_atual: number;
  imc?: number;
  medicacoes_uso?: string;
  id_paciente: number;
}

interface PacienteComConsultas extends Paciente {
  consultas: Consulta[];
  expandido: boolean;
}

@Component({
  selector: 'app-consulta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css']
})
export class ConsultaComponent implements OnInit {
  pacientesComConsultas: PacienteComConsultas[] = [];
  pacientesFiltrados: PacienteComConsultas[] = [];
  pacientes: Paciente[] = [];
  mostrarFormulario: boolean = false;
  termoBusca: string = '';
  pacienteSelecionadoId: number = 0;

  consultaAtual: Consulta = {
    data_consulta: '',
    horario_consulta: '',
    tipo: 'primeira',
    objetivo: '',
    altura: 0,
    peso_atual: 0,
    medicacoes_uso: '',
    id_paciente: 0
  };

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    // TODO: Substituir por chamadas HTTP
    this.pacientes = [
      {
        id_paciente: 1,
        nome: 'Maria',
        sobrenome: 'Silva',
        celular: '11987654321',
        data_nascimento: '1990-05-15',
        sexo: 'feminino',
        email: 'maria@email.com'
      },
      {
        id_paciente: 2,
        nome: 'João',
        sobrenome: 'Santos',
        celular: '11976543210',
        data_nascimento: '1985-08-20',
        sexo: 'masculino',
        email: 'joao@email.com'
      }
    ];

    const todasConsultas: Consulta[] = [
      {
        id_ficha: 1,
        data_consulta: '2024-11-25',
        horario_consulta: '14:00',
        tipo: 'primeira',
        objetivo: 'Perda de peso',
        altura: 1.65,
        peso_atual: 72.5,
        imc: 26.6,
        medicacoes_uso: 'Nenhuma',
        id_paciente: 1
      },
      {
        id_ficha: 2,
        data_consulta: '2024-11-20',
        horario_consulta: '10:00',
        tipo: 'retorno',
        objetivo: 'Perda de peso',
        altura: 1.65,
        peso_atual: 70.2,
        imc: 25.8,
        medicacoes_uso: 'Nenhuma',
        id_paciente: 1
      },
      {
        id_ficha: 3,
        data_consulta: '2024-11-22',
        horario_consulta: '15:30',
        tipo: 'primeira',
        objetivo: 'Ganho de massa muscular',
        altura: 1.78,
        peso_atual: 75.0,
        imc: 23.7,
        medicacoes_uso: 'Whey Protein',
        id_paciente: 2
      }
    ];

    this.pacientesComConsultas = this.pacientes.map(paciente => ({
      ...paciente,
      consultas: todasConsultas.filter(c => c.id_paciente === paciente.id_paciente)
        .sort((a, b) => new Date(b.data_consulta).getTime() - new Date(a.data_consulta).getTime()),
      expandido: false
    }));

    this.pacientesFiltrados = [...this.pacientesComConsultas];
  }

  buscarPacientes(): void {
    const termo = this.termoBusca.toLowerCase();
    this.pacientesFiltrados = this.pacientesComConsultas.filter(p => 
      p.nome.toLowerCase().includes(termo) || 
      p.sobrenome.toLowerCase().includes(termo) ||
      p.email.toLowerCase().includes(termo)
    );
  }

  togglePaciente(paciente: PacienteComConsultas): void {
    paciente.expandido = !paciente.expandido;
  }

  novaConsulta(paciente: PacienteComConsultas): void {
    this.pacienteSelecionadoId = paciente.id_paciente!;
    this.consultaAtual = {
      data_consulta: '',
      horario_consulta: '',
      tipo: 'primeira',
      objetivo: '',
      altura: 0,
      peso_atual: 0,
      medicacoes_uso: '',
      id_paciente: paciente.id_paciente!
    };
    this.mostrarFormulario = true;
  }

  editarConsulta(consulta: Consulta): void {
    this.consultaAtual = { ...consulta };
    this.pacienteSelecionadoId = consulta.id_paciente;
    this.mostrarFormulario = true;
  }

  calcularIMC(): void {
    if (this.consultaAtual.altura > 0 && this.consultaAtual.peso_atual > 0) {
      const alturaMetros = this.consultaAtual.altura;
      this.consultaAtual.imc = Number((this.consultaAtual.peso_atual / (alturaMetros * alturaMetros)).toFixed(1));
    }
  }

  salvarConsulta(): void {
    this.calcularIMC();
    
    // TODO: Substituir por chamada HTTP
    if (this.consultaAtual.id_ficha) {
      // Atualizar
      const paciente = this.pacientesComConsultas.find(p => p.id_paciente === this.consultaAtual.id_paciente);
      if (paciente) {
        const index = paciente.consultas.findIndex(c => c.id_ficha === this.consultaAtual.id_ficha);
        if (index !== -1) {
          paciente.consultas[index] = { ...this.consultaAtual };
        }
      }
    } else {
      // Criar
      const paciente = this.pacientesComConsultas.find(p => p.id_paciente === this.pacienteSelecionadoId);
      if (paciente) {
        this.consultaAtual.id_ficha = Date.now();
        paciente.consultas.unshift({ ...this.consultaAtual });
      }
    }
    
    this.cancelar();
  }

  excluirConsulta(paciente: PacienteComConsultas, consultaId: number): void {
    if (confirm('Tem certeza que deseja excluir esta consulta?')) {
      // TODO: Substituir por chamada HTTP
      paciente.consultas = paciente.consultas.filter(c => c.id_ficha !== consultaId);
    }
  }

  cancelar(): void {
    this.mostrarFormulario = false;
    this.consultaAtual = {
      data_consulta: '',
      horario_consulta: '',
      tipo: 'primeira',
      objetivo: '',
      altura: 0,
      peso_atual: 0,
      medicacoes_uso: '',
      id_paciente: 0
    };
  }

  formatarData(data: string): string {
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
  }

  getClassificacaoIMC(imc: number): string {
    if (imc < 18.5) return 'Abaixo do peso';
    if (imc < 25) return 'Peso normal';
    if (imc < 30) return 'Sobrepeso';
    return 'Obesidade';
  }

  getCorIMC(imc: number): string {
    if (imc < 18.5) return '#ffa726';
    if (imc < 25) return '#66bb6a';
    if (imc < 30) return '#ff8c42';
    return '#ef5350';
  }

  calcularIdade(dataNascimento: string): number {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento + 'T00:00:00');
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  }

  getTotalConsultas(): number {
    return this.pacientesComConsultas.reduce((acc, p) => acc + p.consultas.length, 0);
  }
}