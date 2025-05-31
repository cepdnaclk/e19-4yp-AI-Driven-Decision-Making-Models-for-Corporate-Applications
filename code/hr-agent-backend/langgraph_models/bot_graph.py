from langgraph.graph import StateGraph, END
from langchain.chains import RetrievalQA
from langchain_openai import ChatOpenAI
from app.services.vector_store import get_vector_retriever

class GraphState(dict): pass

def retrieve_answer(state: GraphState) -> GraphState:
    question = state.get("question")
    if not question:
        raise ValueError("Missing 'question' in state.")
    
    retriever = get_vector_retriever()
    qa = RetrievalQA.from_chain_type(llm=ChatOpenAI(), retriever=retriever)
    result = qa.run(question)
    print(f"[DEBUG] Received question: {question}")
    return GraphState({"question": question, "answer": result})

def build_bot_graph():
    builder = StateGraph(GraphState)
    builder.add_node("retrieve", retrieve_answer)
    builder.set_entry_point("retrieve")
    builder.set_finish_point("retrieve")
    return builder.compile()
