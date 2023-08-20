import os
from flask import Flask, request, jsonify
from langchain.embeddings import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain.llms import OpenAI
from glob import glob
from langchain import OpenAI
from langchain.vectorstores import Chroma
from flask_cors import CORS
try:
    from dotenv import load_dotenv
    load_dotenv('.env')
except : 
    print('dotenv error')

from langchain.document_loaders import DirectoryLoader
from langchain.chains import RetrievalQAWithSourcesChain

loader = DirectoryLoader(os.path.join(os.path.dirname(__file__), "converted_texts"), glob="*.txt")
docs = loader.load()
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
documents = text_splitter.split_documents(docs)
db = Chroma.from_documents(documents, OpenAIEmbeddings())
llm = OpenAI(temperature=0)

app = Flask(__name__)
CORS(app)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    prompt = data['prompt']
    qa_chain = RetrievalQAWithSourcesChain.from_chain_type(llm, retriever=db.as_retriever())
    response = qa_chain({"question": prompt})
    memory_output = {'response': response['answer'], 'sources': response['sources']}
    
    return jsonify(memory_output)

@app.route('/hello', methods=['GET'])
def hello():
    return jsonify({"hello": "world"})

if __name__ == "__main__":
    app.run(debug=True)
