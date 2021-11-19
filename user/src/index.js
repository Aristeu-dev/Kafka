import { Kafka } from "kafkajs";

const kafka = new Kafka({
  brokers: ["localhost:9092"],
  clientId: "user",
});

const topic = "issue-user";
const consumer = kafka.consumer({ groupId: "user-group" });

const producer = kafka.producer();

async function run() {
  await consumer.connect();
  await consumer.subscribe({ topic });
  await producer.connect();

  await consumer
    .run({
      eachMessage: async ({ topic, partition, message }) => {
        const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
        console.log(`- ${prefix} ${message.key}#${message.value}`);

        const payload = JSON.parse(message.value);

        producer.send({
          topic: "user-response",
          messages: [
            {
              value: `Usuário ${payload.user.name} foi cadastrado!`,
            },
          ],
        });
      },
    })
    .catch("error of consumer", console.error);
}

run();
