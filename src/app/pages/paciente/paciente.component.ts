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
  primeira_consulta?: string;
  restricao_alimentar?: string;
}

@Component({
  selector: 'app-paciente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.css']
})
export class PacienteComponent implements OnInit {
  pacientes: Paciente[] = [];
  pacientesFiltrados: Paciente[] = [];
  mostrarFormulario: boolean = false;
  modoEdicao: boolean = false;
  termoBusca: string = '';

  pacienteAtual: Paciente = {
    nome: '',
    sobrenome: '',
    celular: '',
    data_nascimento: '',
    sexo: 'feminino',
    email: '',
    restricao_alimentar: ''
  };

  ngOnInit(): void {
    this.carregarPacientes();
  }

  carregarPacientes(): void {
    // TODO: Substituir por chamada HTTP ao backend
    // Exemplo: this.http.get<Paciente[]>('http://localhost:3000/api/pacientes')
    this.pacientes = [
      {
        id_paciente: 1,
        nome: 'Maria',
        sobrenome: 'Silva',
        celular: '11987654321',
        data_nascimento: '1990-05-15',
        sexo: 'feminino',
        email: 'maria@email.com',
        primeira_consulta: '2024-01-10',
        restricao_alimentar: 'Intolerância à lactose'
      }
    ];
    this.pacientesFiltrados = [...this.pacientes];
  }

  buscarPacientes(): void {
    const termo = this.termoBusca.toLowerCase();
    this.pacientesFiltrados = this.pacientes.filter(p => 
      p.nome.toLowerCase().includes(termo) || 
      p.sobrenome.toLowerCase().includes(termo) ||
      p.email.toLowerCase().includes(termo)
    );
  }

  novoPaciente(): void {
    this.modoEdicao = false;
    this.pacienteAtual = {
      nome: '',
      sobrenome: '',
      celular: '',
      data_nascimento: '',
      sexo: 'feminino',
      email: '',
      restricao_alimentar: ''
    };
    this.mostrarFormulario = true;
  }

  editarPaciente(paciente: Paciente): void {
    this.modoEdicao = true;
    this.pacienteAtual = { ...paciente };
    this.mostrarFormulario = true;
  }

  salvarPaciente(): void {
    // TODO: Substituir por chamada HTTP
    // POST para criar: this.http.post('http://localhost:3000/api/pacientes', this.pacienteAtual)
    // PUT para atualizar: this.http.put(`http://localhost:3000/api/pacientes/${id}`, this.pacienteAtual)
    
    if (this.modoEdicao) {
      const index = this.pacientes.findIndex(p => p.id_paciente === this.pacienteAtual.id_paciente);
      if (index !== -1) {
        this.pacientes[index] = { ...this.pacienteAtual };
      }
    } else {
      this.pacienteAtual.id_paciente = this.pacientes.length + 1;
      this.pacientes.push({ ...this.pacienteAtual });
    }
    this.pacientesFiltrados = [...this.pacientes];
    this.cancelar();
  }

  excluirPaciente(id: number): void {
    if (confirm('Tem certeza que deseja excluir este paciente?')) {
      // TODO: Substituir por chamada HTTP
      // DELETE: this.http.delete(`http://localhost:3000/api/pacientes/${id}`)
      this.pacientes = this.pacientes.filter(p => p.id_paciente !== id);
      this.pacientesFiltrados = [...this.pacientes];
    }
  }

  cancelar(): void {
    this.mostrarFormulario = false;
    this.pacienteAtual = {
      nome: '',
      sobrenome: '',
      celular: '',
      data_nascimento: '',
      sexo: 'feminino',
      email: '',
      restricao_alimentar: ''
    };
  }

  formatarData(data: string): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }
}