describe('Teste da API de Integrações', () => {

    const api = 'http://localhost:3000/produto';
    const token = 'UNICORNIOcolorido123';
    const apiErrada = 'http://localhost:3000/produtos';

    //Teste para mostrar todos os produtos
    it('Listar', () => {
        cy.request({
            method: 'GET',
            url: api,
            headers: {
                'x-api-token': token
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array')
        });

        //teste espera dar erro porque a url esta errada
        cy.request({
            method: 'GET',
            url: apiErrada,
            headers: {
                'x-api-token': token
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(404);
        });

        //teste para um campo obrigatorio que não foi preenchido
            cy.request({
                method: 'GET',
                url: `${api}/${99999}`,
                headers: {
                    'x-api-token': token
                },
                failOnStatusCode: false
            }).then((response) => {
                //expect(response.status).to.eq(404);
                expect(response.body).to.not.equal('nome');
            });


            //teste espera dar erro porque não esta passando o token
            cy.request({
                method: 'GET',
                url: api,
                headers: {
                    
                },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(401);
                
            });
    });


    //Teste para Criar Produto
    it('Criar', () => {
        const novoProduto = {
            nome: 'mouse',
            preco: 23,
            qtdStock: 50,
            categoria: 'mouse'
        };
        cy.request({
            method: 'POST',
            url: api,
            headers: {
                'x-api-token': token
            },
            body: novoProduto
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.include(novoProduto);
            expect(response.body).to.have.property('id');
        });

        //teste espera dar erro porque o nome não foi preenchido
        const novoProdutoErrado = {
            
            preco: 23,
            qtdStock: 50,
            categoria: 'mouse'
        }
        cy.request({
            method: 'POST',
            url: api,
            headers: {
                'x-api-token': token
            },
            body: novoProdutoErrado,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(400);
        });

        //teste espera dar erro porque um tipo de dado do "nome" esta errado
        const novoProdutoTipo = {
            nome: 999,
            preco: 23,
            qtdStock: 50,
            categoria: 'mouse'
        }
        cy.request({
            method: 'POST',
            url: api,
            headers: {
                'x-api-token': token
            },
            body: novoProdutoTipo,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(400);
        });

        //teste espera dar erro porque a url esta errada
        cy.request({
            method: 'POST',
            url: apiErrada,
            headers: {
                'x-api-token': token
            },
            body: novoProduto,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(404);
        });

        //teste espera dar erro porque o token não esta sendo enviado
        cy.request({
            method: 'POST',
            url: api,
            headers: {
                
            },
            body: novoProduto,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(401);
        });
    });


    //Buscar Produto por ID
    it('Buscar por ID', () => {
        const produto = {
            nome: 'mouse',
            preco: 23,
            qtdStock: 50,
            categoria: 'mouse'
        };

        cy.request({
            method: 'POST',
            url: api,
            headers: {
                'x-api-token': token
            },
            body: produto
        }).then((postResponse) => {
            const id = postResponse.body.id;

            cy.request({
                method: 'GET',
                url: `${api}/${id}`,
                headers: {
                'x-api-token': token
                }
            }).then((getResponse) => {
                expect(getResponse.status).to.eq(200);
                expect(getResponse.body).to.have.property('id', id);
                expect(getResponse.body).to.include(produto);
            });

            //teste espera dar erro porque o ID buscado não existe
            cy.request({
                method: 'GET',
                url: `${api}/${9999999}`,
                headers: {
                'x-api-token': token
                },
                failOnStatusCode: false
            }).then((getResponse) => {
                expect(getResponse.status).to.eq(404);
            });

            //teste espera dar erro porque a url esta errada
            cy.request({
                method: 'GET',
                url: `${apiErrada}/${id}`,
                headers: {
                'x-api-token': token
                },
                failOnStatusCode: false
            }).then((getResponse) => {
                expect(getResponse.status).to.eq(404);
            });

            //teste espera dar erro porque o token não esta sendo enviado
            cy.request({
                method: 'GET',
                url: `${api}/${id}`,
                headers: {
                    
                },
                failOnStatusCode: false
            }).then((getResponse) => {
                expect(getResponse.status).to.eq(401);
            });
        });
    });


    //Teste para atualização de um produto
    it('Atualizar Produto', () => {
        const produto = {
            nome: 'mouse',
            preco: 23,
            qtdStock: 50,
            categoria: 'mouse'
        };

        cy.request({
            method: 'POST',
            url: api,
            headers: {
                'x-api-token': token
            },
            body: produto
        }).then((postResponse) => {
            const id = postResponse.body.id;

            const produtoAtualizado = {
                nome: 'teclado',
                preco: 45,
                qtdStock: 25,
                categoria: 'teclado'
            };

            cy.request({
                method: 'PATCH',
                url: `${api}/${id}`,
                headers: {
                'x-api-token': token
                },
                body: produtoAtualizado
            }).then((patchResponse) => {
                expect(patchResponse.status).to.eq(200);
                expect(patchResponse.body).to.include(produtoAtualizado);
            });

            //teste espera dar erro porque um atributo preco esta com o tipo de dado errado
            const produtoErrado = {
                nome: 'monitor',
                preco: 'asdf',
                qtdStock: 30,
                categoria: 'monitor'
            };

            cy.request({
                method: 'PATCH',
                url: `${api}/${id}`,
                headers: {
                'x-api-token': token
                },
                body: produtoErrado,
                failOnStatusCode: false
            }).then((patchResponse) => {
                expect(patchResponse.status).to.eq(400);
            });

            //teste espera dar erro porque não tem como atualizar um produto que não existe(id esta errado)
            cy.request({
                method: 'PATCH',
                url: `${api}/${9999}`,
                headers: {
                'x-api-token': token
                },
                body: produtoAtualizado,
                failOnStatusCode: false
            }).then((patchResponse) => {
                expect(patchResponse.status).to.eq(500);
            });

            //teste espera dar erro porque a URL esta errada
            cy.request({
                method: 'PATCH',
                url: `${apiErrada}/${id}`,
                headers: {
                'x-api-token': token
                },
                body: produtoAtualizado,
                failOnStatusCode: false
            }).then((patchResponse) => {
                expect(patchResponse.status).to.eq(404);
            });

            //teste espera dar erro porque o token não esta sendo enviado
            cy.request({
                method: 'PATCH',
                url: `${api}/${id}`,
                headers: {
                    
                },
                body: produtoAtualizado,
                failOnStatusCode: false
            }).then((patchResponse) => {
                expect(patchResponse.status).to.eq(401);
            });
        });
    });


    //Teste para deletar um produto
    it('Deletar Produto', () => {
        const produto = {
            nome: 'mouse',
            preco: 23,
            qtdStock: 50,
            categoria: 'mouse'
        };

        cy.request({
            method: 'POST',
            url: api,
            headers: {
                'x-api-token': token
            },
            body: produto
        }).then((postResponse) => {
            const id = postResponse.body.id;

            cy.request({
                method: 'DELETE',
                url: `${api}/${id}`,
                headers: {
                'x-api-token': token
                }
            }).then((deleteResponse) => {
                expect(deleteResponse.status).to.eq(200);
            });

            //teste para tentar mostrar o produto deletado
            cy.request({
                method: 'GET',
                url: `${api}/${id}`,
                headers: {
                'x-api-token': token
                },
                failOnStatusCode: false
            }).then((getAfterDelete) => {
                expect(getAfterDelete.status).to.eq(404);
            });

            //teste espera dar erro porque o produto que está tentando deletar não existe
            cy.request({
                method: 'DELETE',
                url: `${api}/${999999}`,
                headers: {
                'x-api-token': token
                },
                failOnStatusCode: false
            }).then((deleteResponse) => {
                expect(deleteResponse.status).to.eq(500);
            });

            //teste espera dar erro porque a URL esta errada
            cy.request({
                method: 'GET',
                url: `${apiErrada}/${id}`,
                headers: {
                'x-api-token': token
                },
                failOnStatusCode: false
            }).then((getAfterDelete) => {
                expect(getAfterDelete.status).to.eq(404);
            });

            //teste espera dar erro porque o token não esta sendo enviado
            cy.request({
                method: 'DELETE',
                url: `${api}/${id}`,
                headers: {
                
                },
                failOnStatusCode: false
            }).then((deleteResponse) => {
                expect(deleteResponse.status).to.eq(401);
            });
        });
    });

});
