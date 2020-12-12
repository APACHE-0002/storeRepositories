import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import '../../components/Container/styles.css';
import './styles.css';

export default class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
  };

  //carregar os dados do localStorage
  componentDidMount(){
    const repositories = localStorage.getItem('repositories');

    if(repositories){
      this.setState({ repositories: JSON.parse(repositories)});
    }
  }

  //salvar os dados no localStorage
  componentDidUpdate(_, prevState){
    if(prevState.repositories !== this.state.repositories){
      localStorage.setItem('repositories', JSON.stringify(this.state.repositories));
    }
  }

  //referenciando o valor de input ao state newRepo
  handleInputChange = e =>{
    this.setState({ newRepo: e.target.value });
  };

  //adicionando o valor de newRepo a rota da api do github
  handleSubmit = async e =>{
    e.preventDefault();

    //loading true, para começar a rodar enquanto salva a rota
    this.setState({ loading: true });

    const { newRepo, repositories } = this.state;

    const response = await api.get(`/repos/${newRepo}`);

    const data = {
      name: response.data.full_name,
    };

    //armazenando os repositorios no state/ definido loading false, para parar de rodar
    this.setState({
      repositories: [...repositories, data],
      newRepo: '',
      loading: false,
    });
  };

  render(){
    const { newRepo, loading, repositories } = this.state;

  return(
  <main>
    <h1>
      <FaGithubAlt />
      Repositórios
    </h1>

    <form onSubmit={this.handleSubmit}>
    <input
      type="text"
      placeholder="Adicionar repositório" 
      value={newRepo}
      onChange={this.handleInputChange}
    />

    <button type="submit">
      { loading ? <FaSpinner color="#FFF" size={14} className="low" /> 
      : <FaPlus color="#FFF" size={14}  />
      }
    </button>
    </form>
    
    
    <ul>
      {repositories.map(rep => <li key={rep.name}>{rep.name}<Link to={`/repository/${encodeURIComponent(rep.name)}`}>Detalhes</Link></li>)}
    </ul>

  </main>
  );
  }
}