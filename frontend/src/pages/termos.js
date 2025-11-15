import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { FileText, ArrowLeft, Shield, Lock, Eye } from 'lucide-react';

export default function Termos() {
  return (
    <>
      <Head>
        <title>Termos de Uso | Red Light</title>
        <meta name="description" content="Termos de uso e política de privacidade do Red Light" />
      </Head>

      <Layout>
        <div className="min-h-screen pt-16 bg-black">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Back Button */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para início
            </Link>

            {/* Header */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-orange-500"
              >
                <FileText className="w-10 h-10 text-orange-400" />
              </motion.div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Termos de Uso
              </h1>
              <p className="text-gray-400 text-lg">
                Última atualização: {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
            </div>

            {/* Content */}
            <div className="prose prose-invert prose-red max-w-none">
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 mb-6">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-orange-400" />
                  1. Aceitação dos Termos
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Ao acessar e usar a plataforma digital do Red Light Lounge Bar, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Se você não concordar com qualquer parte destes termos, não deverá usar nossa plataforma.
                </p>
              </div>

              <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 mb-6">
                <h2 className="text-2xl font-bold text-white mb-4">
                  2. Uso da Plataforma
                </h2>
                <div className="text-gray-300 leading-relaxed space-y-4">
                  <p>
                    <strong className="text-white">2.1.</strong> A plataforma permite que você visualize o cardápio, faça pedidos e realize pagamentos de forma digital.
                  </p>
                  <p>
                    <strong className="text-white">2.2.</strong> Você deve ter pelo menos 18 anos de idade para criar uma conta e fazer pedidos que incluam bebidas alcoólicas.
                  </p>
                  <p>
                    <strong className="text-white">2.3.</strong> Você é responsável por manter a confidencialidade de sua conta e senha.
                  </p>
                  <p>
                    <strong className="text-white">2.4.</strong> Você concorda em fornecer informações verdadeiras, precisas, atuais e completas sobre você.
                  </p>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 mb-6">
                <h2 className="text-2xl font-bold text-white mb-4">
                  3. Pedidos e Pagamentos
                </h2>
                <div className="text-gray-300 leading-relaxed space-y-4">
                  <p>
                    <strong className="text-white">3.1.</strong> Todos os pedidos estão sujeitos à disponibilidade dos produtos.
                  </p>
                  <p>
                    <strong className="text-white">3.2.</strong> Os preços podem ser alterados sem aviso prévio.
                  </p>
                  <p>
                    <strong className="text-white">3.3.</strong> O pagamento deve ser realizado no momento do pedido através dos métodos aceitos (cartão, PIX, dinheiro).
                  </p>
                  <p>
                    <strong className="text-white">3.4.</strong> Pedidos não podem ser cancelados após o pagamento ser processado.
                  </p>
                  <p>
                    <strong className="text-white">3.5.</strong> O tempo de preparo é estimado e pode variar de acordo com o movimento do estabelecimento.
                  </p>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 mb-6">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Lock className="w-6 h-6 text-orange-400" />
                  4. Política de Privacidade
                </h2>
                <div className="text-gray-300 leading-relaxed space-y-4">
                  <p>
                    <strong className="text-white">4.1. Dados Coletados:</strong> Coletamos nome, CPF, e-mail, telefone e informações de pagamento.
                  </p>
                  <p>
                    <strong className="text-white">4.2. Uso dos Dados:</strong> Os dados são usados exclusivamente para processar pedidos, melhorar nossos serviços e enviar comunicações relevantes.
                  </p>
                  <p>
                    <strong className="text-white">4.3. Proteção:</strong> Seus dados são protegidos com criptografia e não são compartilhados com terceiros sem seu consentimento.
                  </p>
                  <p>
                    <strong className="text-white">4.4. Direitos (LGPD):</strong> Você tem direito de acessar, corrigir ou excluir seus dados pessoais a qualquer momento.
                  </p>
                  <p>
                    <strong className="text-white">4.5. Cookies:</strong> Usamos cookies para melhorar sua experiência na plataforma.
                  </p>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 mb-6">
                <h2 className="text-2xl font-bold text-white mb-4">
                  5. Responsabilidades
                </h2>
                <div className="text-gray-300 leading-relaxed space-y-4">
                  <p>
                    <strong className="text-white">5.1.</strong> O Red Light não se responsabiliza por erros de pedidos causados por informações incorretas fornecidas pelo usuário.
                  </p>
                  <p>
                    <strong className="text-white">5.2.</strong> Reservamos o direito de recusar serviço a qualquer pessoa por qualquer motivo a qualquer momento.
                  </p>
                  <p>
                    <strong className="text-white">5.3.</strong> Não somos responsáveis por interrupções no serviço devido a manutenção ou problemas técnicos.
                  </p>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 mb-6">
                <h2 className="text-2xl font-bold text-white mb-4">
                  6. Consumo Responsável
                </h2>
                <div className="text-gray-300 leading-relaxed space-y-4">
                  <p>
                    <strong className="text-white">6.1.</strong> Bebidas alcoólicas não serão servidas para menores de 18 anos.
                  </p>
                  <p>
                    <strong className="text-white">6.2.</strong> Reservamos o direito de recusar venda de bebidas alcoólicas se julgarmos necessário.
                  </p>
                  <p>
                    <strong className="text-white">6.3.</strong> Incentivamos o consumo responsável e oferecemos opções não-alcoólicas.
                  </p>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-700 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-4">
                  7. Contato
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Para questões sobre estes termos ou sobre privacidade, entre em contato:
                </p>
                <div className="text-gray-300 space-y-2">
                  <p><strong className="text-white">E-mail:</strong> contato@redlight.rio</p>
                  <p><strong className="text-white">Telefone:</strong> (21) 99999-0000</p>
                  <p><strong className="text-white">Endereço:</strong> Rua Arnaldo Quintela, 19 - Botafogo, RJ</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 text-center">
              <p className="text-gray-500 text-sm mb-6">
                Ao continuar usando nossa plataforma, você confirma que leu e concordou com estes termos.
              </p>
              <Link
                href="/"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
              >
                Voltar para Início
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
