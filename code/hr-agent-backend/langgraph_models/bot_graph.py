from langgraph.graph import StateGraph, END
from langchain.chains import RetrievalQA
# from langchain.chat_models import ChatOpenAI
from langchain_community.chat_models import ChatOpenAI
from app.services.vector_store import get_vector_retriever

class GraphState(dict): pass

def retrieve_answer(state: GraphState) -> GraphState:
    retriever = get_vector_retriever()
    qa = RetrievalQA.from_chain_type(llm=ChatOpenAI(), retriever=retriever)
    result = qa.run(state["question"])
    return GraphState({"answer": result})

def build_bot_graph():
    builder = StateGraph(GraphState)
    builder.add_node("retrieve", retrieve_answer)
    builder.set_entry_point("retrieve")
    builder.set_finish_point("retrieve")
    return builder.compile()
