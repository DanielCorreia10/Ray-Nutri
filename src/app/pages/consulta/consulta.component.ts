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
  nomePaciente?: string;
}

@Component({
  selector: 'app-consulta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css']
})
export class ConsultaComponent implements OnInit {
  consultas: Consulta[] = [];
  consultasFiltradas: Consulta[] = [];
  pacientes: Paciente[] = [];
  mostrarFormulario: boolean = false;
  modoEdicao: boolean = false;
  termoBusca: string = '';

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
    this.carregarPacientes();
    this.carregarConsultas();
  }

  carregarPacientes(): void {
    // TODO: Substituir por chamada HTTP
    // this.http.get<Paciente[]>('http://localhost:3000/api/pacientes')
    this.pacientes = [
      {
        id_paciente: 1,
        nome: 'Maria',
        sobrenome: 'Silva',
        celular: '11987654321',
        data_nascimento: '1990-05-15',
        sexo: 'feminino',
        email: 'maria@email.com'
      }
    ];
  }

  carregarConsultas(): void {
    // TODO: Substituir por chamada HTTP
    // this.http.get<Consulta[]>('http://localhost:3000/api/consultas')
    this.consultas = [
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
        id_paciente: 1,
        nomePaciente: 'Maria Silva'
      }
    ];
    this.consultasFiltradas = [...this.consultas];
  }

  buscarConsultas(): void {
    const termo = this.termoBusca.toLowerCase();
    this.consultasFiltradas = this.consultas.filter(c => 
      c.nomePaciente?.toLowerCase().includes(termo) || 
      c.objetivo.toLowerCase().includes(termo)
    );
  }

  novaConsulta(): void {
    this.modoEdicao = false;
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
    this.mostrarFormulario = true;
  }

  editarConsulta(consulta: Consulta): void {
    this.modoEdicao = true;
    this.consultaAtual = { ...consulta };
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
    
    const pacienteSelecionado = this.pacientes.find(p => p.id_paciente === this.consultaAtual.id_paciente);
    if (pacienteSelecionado) {
      this.consultaAtual.nomePaciente = `${pacienteSelecionado.nome} ${pacienteSelecionado.sobrenome}`;
    }

    // TODO: Substituir por chamada HTTP
    // POST: this.http.post('http://localhost:3000/api/consultas', this.consultaAtual)
    // PUT: this.http.put(`http://localhost:3000/api/consultas/${id}`, this.consultaAtual)

    if (this.modoEdicao) {
      const index = this.consultas.findIndex(c => c.id_ficha === this.consultaAtual.id_ficha);
      if (index !== -1) {
        this.consultas[index] = { ...this.consultaAtual };
      }
    } else {
      this.consultaAtual.id_ficha = this.consultas.length + 1;
      this.consultas.push({ ...this.consultaAtual });
    }
    
    this.consultasFiltradas = [...this.consultas];
    this.cancelar();
  }

  excluirConsulta(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta consulta?')) {
      // TODO: Substituir por chamada HTTP
      // DELETE: this.http.delete(`http://localhost:3000/api/consultas/${id}`)
      this.consultas = this.consultas.filter(c => c.id_ficha !== id);
      this.consultasFiltradas = [...this.consultas];
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
    return new Date(data).toLocaleDateString('pt-BR');
  }

  getClassificacaoIMC(imc: number): string {
    if (imc < 18.5) return 'Abaixo do peso';
    if (imc < 25) return 'Peso normal';
    if (imc < 30) return 'Sobrepeso';
    return 'Obesidade';
  }
}