<script setup lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import {OpinionService} from "@/services/opinions/OpinionService";
import { type AgreeingType, OpinionGraph} from "@/services/opinions";
import * as vNG from "v-network-graph"
import {
  ForceLayout,
  type ForceNodeDatum,
  type ForceEdgeDatum,
} from "v-network-graph/lib/force-layout"
import {VNetworkGraph} from "v-network-graph";
import {useDiscussionStore} from "@/stores/DiscussionStore";
import {useRouter} from "vue-router";

interface Props {
  topicId: string;
}

type GraphNode = {
  [index: string]: {
    name: string;
    agree: AgreeingType;
    id: number;
    size: number;
  }
}

type GraphEdge = {
  [index: string]: {
    source: string;
    target: string;
  }
}

type GraphLayout = {
  nodes: {
    [index: string]: {
      x: number;
      y: number;
      fixed: boolean;
    }
  }
}

const props = defineProps<Props>();
const nodes = ref<GraphNode>({});
const edges = ref<GraphEdge>({});
const layouts = ref<GraphLayout>({nodes: {}})
const router = useRouter();
const nodeCount = ref(0);
const sizeOfNode = new Map<number, number>();

const eventHandlers: vNG.EventHandlers = {
  "node:click": ({ node }) => {
    const topicId = parseInt(props.topicId);
    router.push(`/discussion/${topicId}`);
    const store = useDiscussionStore();
    store.setOpinionIdWhenRedirect(nodes.value[node].id);
  },
}

// @ts-ignore
const configs = reactive(
    vNG.defineConfigs({
      view: {
        layoutHandler: new ForceLayout({
          positionFixedByDrag: false,
          positionFixedByClickWithAltKey: true,
          createSimulation: (d3, nodes, edges) => {
            // d3-force parameters
            const forceLink = d3.forceLink<ForceNodeDatum, ForceEdgeDatum>(edges).id((d: unknown) => {
              if (typeof d === 'object' && d !== null && 'id' in d) {
                return d.id;
              }

              return '';
            })
            return d3
                .forceSimulation(nodes)
                .force("edge", forceLink.distance(90).strength(0.2))
                .force("charge", d3.forceManyBody().strength(-1000))
                .force("center", d3.forceCenter().strength(0.05))
                .alphaMin(0.001)

            // * The following are the default parameters for the simulation.
            // const forceLink = d3.forceLink<ForceNodeDatum, ForceEdgeDatum>(edges).id(d => d.id)
            // return d3
            //   .forceSimulation(nodes)
            //   .force("edge", forceLink.distance(100))
            //   .force("charge", d3.forceManyBody())
            //   .force("collide", d3.forceCollide(50).strength(0.2))
            //   .force("center", d3.forceCenter().strength(0.05))
            //   .alphaMin(0.001)
          }
        }),
      },
      node: {
        normal: {
          color: n => (n.agree === "disagree" ? "#ff0000" : "#4466cc"),
          radius: node => node.size,
        },
        label: {
          visible: true,
        },
      },
      edge: {
        normal: {
          width: 3,
          color: "#aaaaaa",
          dasharray: "0",
          linecap: "butt",
          animate: false,
          animationSpeed: 50,
        },
        marker: {
          source: {
            type: "none",
            width: 4,
            height: 4,
            margin: -1,
            offset: 0,
            units: "strokeWidth",
            color: null,
          },
          target: {
            type: "arrow",
            width: 4,
            height: 4,
            margin: -1,
            offset: 0,
            units: "strokeWidth",
            color: null,
          },
        },
      }
    })
)

buildNetwork(nodeCount.value, nodes.value, edges.value)

watch(nodeCount, () => {
  buildNetwork(nodeCount.value, nodes.value, edges.value)
})

onMounted(async  () => {
  const opinionService = new OpinionService();
  const opinionsData: OpinionGraph[] = await opinionService.fetchGraphInTopic(parseInt(props.topicId));
  let isMostFocusingNode = true;

  /**
   * 의견(A) <--- 참조된 의견(B) x N
   * A를 노드로 등록함
   */
  opinionsData.forEach(opinion => {
    sizeOfNode.set(opinion.referToId, opinion.count);

    createNode(opinion.referToId, opinion.title, opinion.agreeType);
  });

  /**
   * 의견(A) <--- 참조된 의견(B) x N
   * B를 노드로 등록하고 엣지를 생성함.
   * A가 이미 등록되어 있어도 상관은없음.
   */
  opinionsData.forEach(graph => {
    graph.opinions.forEach(opinion => {
      createNode(opinion.id, opinion.title, opinion.agreeType);

      if(isMostFocusingNode) {
        layouts.value.nodes[getNodeName(opinion.id)] = {
          x: 0,
          y: 0,
          fixed: true,
        }
        isMostFocusingNode = false;
      }

      const edgeName = "edge"+opinion.id.toString();
      edges.value[edgeName] = {
        source: getNodeName(opinion.id),
        target: "node"+graph.referToId.toString()
      };
    })
  })
});

function getNodeName(id: number) {
  return "node"+id.toString();
}

function createNode(id: number, title: string, agreeType: AgreeingType) {
  const defaultNodeSize = 5;
  const centralizeNodeSizeMultiply = 2;

  const nodeName = getNodeName(id);
  let size = defaultNodeSize;
  if(sizeOfNode.has(id)) {
    size = size * centralizeNodeSizeMultiply * sizeOfNode.get(id)!;
  }

  nodes.value[nodeName] = {
    name: title.slice(0,10) + "...",
    agree: agreeType,
    id: id,
    size: size
  };
}

function buildNetwork(count: number, nodes: vNG.Nodes, edges: vNG.Edges) {
  const idNums = [...Array(count)].map((_, i) => i)

  // nodes
  const newNodes = Object.fromEntries(idNums.map(id => [`node${id}`, {}]))
  Object.keys(nodes).forEach(id => delete nodes[id])
  Object.assign(nodes, newNodes)

  // edges
  const makeEdgeEntry = (id1: number, id2: number) => {
    return [`edge${id1}-${id2}`, { source: `node${id1}`, target: `node${id2}` }]
  }
  const newEdges = Object.fromEntries([
    ...idNums
        .map(n => [n, (Math.floor(n / 4) * 4) % count])
        .map(([n, m]) => (n === m ? [n, (n + 4) % count] : [n, m]))
        .map(([n, m]) => makeEdgeEntry(n, m)),
  ])
  Object.keys(edges).forEach(id => delete edges[id])
  Object.assign(edges, newEdges)
}
</script>

<template>
  <v-network-graph
      class="graph"
      :zoom-level="0.5"
      :nodes="nodes"
      :edges="edges"
      :configs="configs"
      :layouts="layouts"
      :event-handlers="eventHandlers"
  />
</template>

<style>
.graph {
  width: 600px;
  height: 400px;
}
</style>