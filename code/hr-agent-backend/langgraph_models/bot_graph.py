from langgraph.graph import StateGraph, END
from langchain.chains import RetrievalQA
from langchain_openai import ChatOpenAI
from app.services.vector_store import get_vector_retriever

class GraphState(dict): pass

llm = ChatOpenAI(model="gpt-4o", temperature=0.3)

def retrieve_answer(state: GraphState) -> GraphState:
    print(f"[DEBUG] Full state received: {state}")
    question = state.get("question")
    if not question:
        raise ValueError("Missing 'question' in state.")
    
    retriever = get_vector_retriever()
    qa = RetrievalQA.from_chain_type(llm=llm, retriever=retriever)
    result = qa.invoke({"query": question})
    return {"question": question, "answer": result}

def build_bot_graph():
    builder = StateGraph(dict)
    builder.add_node("retrieve", retrieve_answer)
    builder.set_entry_point("retrieve")
    builder.set_finish_point("retrieve")
    return builder.compile()
