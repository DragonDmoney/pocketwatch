print("sync file called")
import requests
import json
from tqdm import tqdm
import time
from models import *
from pokt import Pokt
import datetime
import dateutil
from dateutil.parser import *
headers = {"Content-Type": "application/json", "Accept": "Accept: application/json"}
print("in sync file")

time.sleep(30)
node = Pokt('pocket:8081')
print(node.block_txs(1000),flush=True)
print("after POKT node init",flush=True)
def ex(cmd):
        c.execute(cmd)

def blockInfo(block):
        # time.sleep(5)
        print("blockInfostart", flush=True)
        relays, height, time, txs, proposer = node.block(block)
        print("app and node count", flush=True)
        apps = node.app_count(block)
        print("node count", flush=True)
        nodes = node.node_count(block)

        # ex(f'UPDATE pulse SET nodes={nodes}, apps={apps}')
        print("pulse shit", flush=True)
        pulse = Pulse.get(id=1)
        pulse.nodes = nodes
        pulse.apps = apps
        pulse.save()
        print("creating block", flush=True)
        Blocks.create(height=block, producer=proposer, relays=relays, txs=txs)
        # ex(f"INSERT INTO blocks VALUES ({block},'{blockProducer}',{relays},{txs})")

        return True


def syncBlock(block):
        print("syncblock:",block,flush=True)
        if block == 30024:
                return False
        print("attempting blocktime", flush=True)
        block_time = node.block_time(block)

        start = time.time()
        print("attempting blockinformation", flush=True)
        while blockInfo(block)==False:
                print("node has not processed block", flush=True)
                time.sleep(10)
        print(block,flush=True)
        txs = node.block_txs(block)

        print("block txs", time.time()-start)
        block = time.time()
        slim_txs = []

        for tx in txs:
                x = node.strip_tx(tx)
                if x != None:
                        hash, receiver, sender, value, type, fee, height, index, code, memo, chain = node.strip_tx(tx)
                        slim_txs.append({"hash":hash, "receiver": receiver, "sender": sender, "value": value, "type": type, "fee": fee, "height": height, "index": index, "code": code, "memo": memo, "chain":chain, "timestamp": parse(block_time)})

        print("computation: ", time.time()-block)
        computation = time.time()

        if len(txs)>0:
                Transaction.insert_many(slim_txs).execute()
        print("insertion, ", time.time()-computation)
        print("total: ", time.time()-start)

print('live sync')

def syncMempool():
        query = Transaction.delete().where(Transaction.height==-1)

        raw_txs = node.mempool(100000)
        print("mempool: ", len(raw_txs), flush=True)
        slim_txs = []

        for tx in raw_txs:
                hash, receiver, sender, value, type, fee, height, index, code, memo, chain = node.strip_raw_tx(tx)
                slim_txs.append({"hash":hash, "receiver": receiver, "sender": sender, "value": value, "type": type, "fee": fee, "height": height, "index": index, "code": code, "memo": memo, "chain":chain, "timestamp": datetime.datetime.now()})

        if len(raw_txs)>0:
                # print(slim_txs)
                query.execute()
                Transaction.insert_many(slim_txs).execute()


print('testing')
while True:
        currHeight = State[1].height
        tarHeight= node.height()
        print(currHeight,tarHeight,flush=True)
        if tarHeight==currHeight:
                print("mempool", flush=True)
                syncMempool()
                time.sleep(3)
        else:
                print("not syncing mempool", flush=True)
                pass
        if tarHeight > currHeight:

                print('about to sync block',flush=True)
                syncBlock(currHeight+1)
                print(f"{time.time()}      Success! Synced block: {currHeight+1}",flush=True)
                # time.sleep(0.01)
                # ex(f'UPDATE STATE SET height={currHeight+1}')
                state = State[1]
                state.height = currHeight+1
                state.save()
                # connection.commit(
                        # time.sleep(30)
        else:
                # print(tarHeight, currHeight)
                #syncMempool()

                time.sleep(10)
