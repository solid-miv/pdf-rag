import os
from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS
from werkzeug.utils import secure_filename
from groq_llm_client import setup_rag_system, query_documents


MAX_FILE_SIZE = 10 * 1024 * 1024  # 10mb in bytes

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = '/app/storage/docs'
ALLOWED_EXTENSIONS = {'pdf', 'docx'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'files' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    files = request.files.getlist('files')
    
    for file in files:
        if file and allowed_file(file.filename):
            # check file size
            file.seek(0, os.SEEK_END)
            size = file.tell()
            file.seek(0)
            
            if size > MAX_FILE_SIZE:
                return jsonify({'error': f'File {file.filename} exceeds {MAX_FILE_SIZE/1024/1024}MB limit'}), 400
                
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    
    # update RAG system with new docs
    setup_rag_system()
    
    return jsonify({'message': 'Files uploaded successfully'}), 200


@app.route('/api/query', methods=['POST'])
def process_query():
    data = request.json
    if not data or 'query' not in data:
        return jsonify({'error': 'No query provided'}), 400
    
    try:
        def generate():
            for token in query_documents(data['query']):
                # Format as Server-Sent Events
                yield f"data: {token}\n\n"
                
        return Response(
            stream_with_context(generate()),
            mimetype='text/event-stream',
            headers={
                'Cache-Control': 'no-cache',
                'Transfer-Encoding': 'chunked'
            }
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/health')
def health_check():
    return jsonify({'status': 'healthy'}), 200


@app.route('/api/documents/<filename>', methods=['DELETE'])
def delete_document(filename):
    try:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        if os.path.exists(file_path):
            os.remove(file_path)
            # rebuild RAG system after deleting the file
            setup_rag_system()
            return jsonify({'message': 'Document deleted successfully'}), 200
        return jsonify({'error': 'Document not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)